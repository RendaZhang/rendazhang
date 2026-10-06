// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { hash, serialize } from 'ohash';
import { createUnifont, defineFontProvider, type FontFaceData } from 'unifont';

describe('reviewed transitive font cache compatibility', () => {
  it('keeps hashes independent of object insertion order, including non-ASCII keys', () => {
    const options = { weights: ['400'], styles: ['normal'], formats: ['woff2'] };
    expect(hash(options)).toBe(hash({ formats: ['woff2'], styles: ['normal'], weights: ['400'] }));
    expect(hash({ '\u00e9': 1, z: 2 })).toBe(hash({ z: 2, '\u00e9': 1 }));
    // Non-ASCII keys now sort after printable ASCII by code unit; old hashes may differ.
    expect(serialize({ '\u00e9': 1, z: 2 })).toBe('{z:2,\u00e9:1}');
    expect(hash(options)).not.toBe(hash({ ...options, weights: ['700'] }));
  });

  it('reuses real unifont cache identities across equivalent provider options without fetching', async () => {
    const entries = new Map<string, string | Record<string, unknown>>();
    const initialize = vi.fn((): FontFaceData[] => [
      { src: [{ name: 'Arial' }], weight: '400', style: 'normal' }
    ]);
    const provider = defineFontProvider(
      'offline-regression',
      (_options: Record<string, string>, { storage }) => ({
        resolveFont: async (family) => ({
          fonts: await storage.getItem(`font-${hash(family)}`, initialize),
          fallbacks: ['sans-serif']
        })
      })
    );
    const storage = {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string | Record<string, unknown>) => {
        entries.set(key, value);
      }
    };
    const first = await createUnifont([provider({ family: 'Arial', '\u00e9': 'one', z: 'two' })], {
      storage,
      throwOnError: true
    });
    const result = await first.resolveFont('Public font \u5b57\u4f53');
    const second = await createUnifont([provider({ z: 'two', '\u00e9': 'one', family: 'Arial' })], {
      storage,
      throwOnError: true
    });
    expect(await second.resolveFont('Public font \u5b57\u4f53')).toEqual(result);
    expect(result).toMatchObject({
      provider: 'offline-regression',
      fonts: [{ src: [{ name: 'Arial' }], weight: '400', style: 'normal' }],
      fallbacks: ['sans-serif']
    });
    expect(initialize).toHaveBeenCalledOnce();
    expect(entries.size).toBe(1);
    expect([...entries.keys()][0]).toMatch(/^offline-regression:[\w-]+:font-[\w-]+$/);
    await second.resolveFont('Different public family');
    expect(initialize).toHaveBeenCalledTimes(2);
  });
});
