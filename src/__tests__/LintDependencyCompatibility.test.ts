// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('lint dependency compatibility', () => {
  it.each([
    'consumer-resolution',
    'humanfs-walk',
    'humanfs-copy',
    'humanfs-copy-all',
    'ajv-table',
    'ajv-yaml',
    'uri-idn',
    'uri-ipv6',
    'uri-percent',
    'uri-scheme',
    'uri-authority',
    'uri-host-case',
    'color-parsers',
    'stylelint-colors',
    'selector-ast',
    'selector-bounds',
    'lint-selectors'
  ])(
    '%s with real consumers and bounded offline fixtures',
    (scenario) => {
      // The parent owns cleanup even if a synchronous library call times out.
      const root = mkdtempSync(join(tmpdir(), 'personalweb-lint-'));
      try {
        const child = spawnSync(
          process.execPath,
          [
            '--unhandled-rejections=strict',
            fileURLToPath(new URL('./fixtures/lint-dependency-bounded.mjs', import.meta.url)),
            scenario,
            root
          ],
          { encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 64 * 1024 }
        );
        expect(child.error, child.stderr).toBeUndefined();
        expect(child.signal, child.stderr).toBeNull();
        expect(child.status, child.stderr).toBe(0);
        expect(child.stdout.trim()).toBe(`${scenario}: after-checks`);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    },
    10000
  );

  it('records the runtime for local and Linux CI evidence', () => {
    expect(['darwin', 'linux']).toContain(process.platform);
    process.stdout.write(
      `Lint dependency evidence: ${process.platform}; Node ${process.version}\n`
    );
  });
});
