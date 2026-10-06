// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('Astro SVG tooling compatibility', () => {
  // Bound even synchronous parser/plugin failures; fixtures never execute SVG content.
  it.each([
    'consumer-resolution',
    'astro-wrapper',
    'xast-selectors',
    'invalid-xml',
    'valid-unicode',
    'foreign-object',
    'namespace-links',
    'data-urls'
  ])(
    '%s with real libraries and small offline inputs',
    (scenario) => {
      const child = spawnSync(
        process.execPath,
        [
          '--unhandled-rejections=strict',
          fileURLToPath(new URL('./fixtures/svg-tooling-bounded.mjs', import.meta.url)),
          scenario
        ],
        { encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 64 * 1024 }
      );
      expect(child.error, child.stderr).toBeUndefined();
      expect(child.signal, child.stderr).toBeNull();
      expect(child.status, child.stderr).toBe(0);
      expect(child.stdout.trim()).toBe(`${scenario}: after-checks`);
    },
    10000
  );
});
