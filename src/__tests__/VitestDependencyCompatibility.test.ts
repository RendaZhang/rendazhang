// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assert, describe, expect, expectTypeOf, it } from 'vitest';

describe('Vitest dependency compatibility', () => {
  it.each([
    'consumer-resolution',
    'allowed-redirect',
    'outside-root',
    'denied-root-file',
    'controlled-registry',
    'local-env',
    'github-env',
    'colors',
    'symbol-reporter'
  ])(
    '%s with real consumers and bounded fixtures',
    (scenario) => {
      const root = mkdtempSync(join(tmpdir(), 'personalweb-vitest-'));
      try {
        // Isolate detection from developer/CI secrets; the parent owns timeout cleanup.
        const child = spawnSync(
          process.execPath,
          [
            '--unhandled-rejections=strict',
            fileURLToPath(new URL('./fixtures/vitest-dependency-bounded.mjs', import.meta.url)),
            scenario,
            root
          ],
          {
            encoding: 'utf8',
            timeout: 15000,
            killSignal: 'SIGKILL',
            maxBuffer: 128 * 1024,
            env: {
              PATH: dirname(process.execPath),
              HOME: root,
              TMPDIR: root,
              NODE_ENV: 'test',
              ...(scenario === 'github-env'
                ? { CI: 'true', GITHUB_ACTIONS: 'true', FORCE_COLOR: '1' }
                : { NO_COLOR: '1' })
            }
          }
        );
        expect(child.error, child.stderr).toBeUndefined();
        expect(child.signal, child.stderr).toBeNull();
        expect(child.status, child.stderr).toBe(0);
        expect(child.stdout.trim()).toBe(`${scenario}: after-checks`);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
    20000
  );

  it('preserves Chai unique-key and deep include assertions and rejects wrong values', () => {
    expect({ a: 1 }).to.have.all.keys(['a', 'a']);
    expect(() => expect({ a: 1, b: 2 }).to.have.all.keys(['a', 'a'])).toThrow();
    expect([{ id: 1 }]).to.deep.include.oneOf([{ id: 1 }, { id: 2 }]);
    expect(() => expect([{ id: 1 }]).to.deep.include.oneOf([{ id: 3 }])).toThrow();
    expect({ zero: 0, empty: '' }).to.have.property('zero', 0);
    expect({ zero: 0, empty: '' }).to.have.property('empty', '');
  });

  it('uses callable iterators and reports invalid iterators as assertion failures', () => {
    assert.sameMembers([1, 2], [2, 1]);
    expect(new Set([1, 2])).to.have.members([2, 1]);
    const invalid = { [Symbol.iterator]: 1 };
    expect(() => expect(invalid).to.have.members([1])).toThrow(/iterable/);
  });

  it('checks positive, negative and overload-this types under the project TypeScript gate', () => {
    type Overloaded = {
      (this: { kind: 'text' }, value: string): string;
      (this: { kind: 'number' }, value: number): number;
    };
    expectTypeOf<{ id: number }>().toEqualTypeOf<{ id: number }>();
    expectTypeOf<string>().not.toEqualTypeOf<number>();
    expectTypeOf<Overloaded>().thisParameter.toEqualTypeOf<{ kind: 'text' } | { kind: 'number' }>();
    expectTypeOf<Overloaded>().parameters.toEqualTypeOf<[string] | [number]>();
    // @ts-expect-error Intentional negative relation must remain a compiler error.
    expectTypeOf<string>().toEqualTypeOf<number>();
  });

  it('records the actual local and Linux runner runtime', () => {
    expect(['darwin', 'linux']).toContain(process.platform);
    process.stdout.write(
      `Vitest dependency evidence: ${process.platform}; Node ${process.version}\n`
    );
  });
});
