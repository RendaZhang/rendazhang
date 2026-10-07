import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const tokensCss = readFileSync('src/styles/core/tokens.css', 'utf8');
const themeTokensCss = readFileSync('src/styles/core/theme-tokens.css', 'utf8');

describe('theme palette tokens', () => {
  it('checks actual six-set CSS roles, state colors and transparent composites', () => {
    const result = JSON.parse(
      execFileSync(process.execPath, ['scripts/contrast-check.mjs'], {
        encoding: 'utf8',
        timeout: 5000
      })
    ) as { checks: number; minimumText: number; results: { name: string }[] };
    expect(result.checks).toBe(414);
    expect(result.minimumText).toBeGreaterThanOrEqual(4.5);
    for (const palette of ['default', 'aurora', 'forest']) {
      for (const mode of ['light', 'dark']) {
        expect(
          result.results.filter(({ name }) => name.startsWith(`${palette} ${mode} `))
        ).toHaveLength(69);
      }
    }
    expect(themeTokensCss).not.toMatch(/--color-gray-900:\s*var\(--palette-/);
    expect(themeTokensCss).toContain('--color-white: var(--color-base-white)');
  });

  it('uses explicit dark on-primary and distinct light decorative accents', () => {
    for (const family of ['ink', 'cobalt', 'pine']) {
      expect(themeTokensCss).toContain(
        `--color-on-primary: var(--palette-${family}-dark-on-primary)`
      );
    }
    expect(tokensCss).toContain('--palette-cobalt-light-accent: #944426');
    expect(tokensCss).toContain('--palette-cobalt-light-decoration: #b95a36');
    expect(tokensCss).toContain('--palette-pine-light-accent: #766016');
    expect(tokensCss).toContain('--palette-pine-light-decoration: #e2c75b');
  });

  it('matches combined selectors and honors specificity, source order and direct declarations', () => {
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import { rootTokens } from './scripts/contrast-check.mjs';
      import postcss from 'postcss';
      import assert from 'node:assert/strict';
      const css = postcss.parse(\`
        :root { --test: base; .child { --test: wrong; } }
        html:root[data-palette='aurora'][data-theme='dark'], html[data-palette='forest'] { --test: combined; }
        html:root[data-palette='aurora'] { --test: light; }
        :root { --test: late-base; }
        html[data-palette='forest'] { --test: later-equal; }
      \`);
      assert.equal(rootTokens('dark', 'aurora', [css]).value('--test'), 'combined');
      assert.equal(rootTokens('light', 'aurora', [css]).value('--test'), 'light');
      assert.equal(rootTokens('dark', 'forest', [css]).value('--test'), 'later-equal');
      assert.equal(rootTokens('light', 'invalid', [css]).value('--test'), 'late-base');
    `
      ],
      { encoding: 'utf8', timeout: 5000 }
    );
    expect(output).toContain('"checks": 414');
  });
});
