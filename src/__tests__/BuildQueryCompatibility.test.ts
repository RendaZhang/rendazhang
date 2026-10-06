// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import browserslist from 'browserslist';
import { getCompatibleVersions } from 'baseline-browser-mapping';

const require = createRequire(import.meta.url);
const sentryRequire = createRequire(require.resolve('@sentry/bundler-plugins/core'));
const globRequire = createRequire(sentryRequire.resolve('glob'));
const estreeRequire = createRequire(require.resolve('@typescript-eslint/typescript-estree'));
const eslintRequire = createRequire(require.resolve('eslint'));
const babelRequire = createRequire(require.resolve('@babel/core'));
const helperRequire = createRequire(babelRequire.resolve('@babel/helper-compilation-targets'));
const browsersRequire = createRequire(helperRequire.resolve('browserslist'));

interface Matcher {
  braceExpand(pattern: string): string[];
  Minimatch: new (pattern: string) => { match(path: string): boolean };
}

const consumers = [
  { name: 'ESLint', require: eslintRequire, matcher: '3.1.5', brace: '1.1.21' },
  { name: 'Sentry glob', require: globRequire, matcher: '10.2.6', brace: '5.0.12' },
  { name: 'typescript-estree', require: estreeRequire, matcher: '10.2.6', brace: '5.0.12' }
];

describe('build query and target-data compatibility', () => {
  it.each(consumers)('resolves and matches the real $name consumer', (consumer) => {
    const matcherRequire = createRequire(consumer.require.resolve('minimatch'));
    const matcher = consumer.require('minimatch') as Matcher;
    expect(matcherRequire('minimatch/package.json').version).toBe(consumer.matcher);
    expect(matcherRequire('brace-expansion/package.json').version).toBe(consumer.brace);
    for (const [pattern, expected] of [
      ['*.{js,css}.map', ['*.js.map', '*.css.map']],
      ['chunk-{01..03}.js', ['chunk-01.js', 'chunk-02.js', 'chunk-03.js']],
      ['{client,{server,shared}}.js', ['client.js', 'server.js', 'shared.js']],
      [String.raw`file-\{literal\}.js`, ['file-{literal}.js']]
    ] as const) {
      expect(matcher.braceExpand(pattern)).toEqual(expected);
    }
    const match = new matcher.Minimatch('**/*.{js,css}.map');
    expect(
      ['client/app.js.map', 'style.css.map', 'app.js', '.hidden.js.map'].filter((p) =>
        match.match(p)
      )
    ).toEqual(['client/app.js.map', 'style.css.map']);
  });

  it('keeps both nested brace nodes distinct and tests Sentry-style finite glob selection', async () => {
    const globMatcher = createRequire(globRequire.resolve('minimatch'));
    const estreeMatcher = createRequire(estreeRequire.resolve('minimatch'));
    expect(globMatcher.resolve('brace-expansion')).not.toBe(
      estreeMatcher.resolve('brace-expansion')
    );
    const glob = sentryRequire('glob') as typeof import('glob');
    const root = mkdtempSync(join(tmpdir(), 'personalweb-query-'));
    try {
      mkdirSync(join(root, 'client'));
      mkdirSync(join(root, 'ignored'));
      for (const name of [
        'client/app.js.map',
        'client/app.js',
        'style.css.map',
        'ignored/skip.js.map',
        '.hidden.js.map'
      ]) {
        writeFileSync(join(root, name), '{}\n');
      }
      expect(
        await glob.glob('**/*.{js,css}.map', {
          cwd: root,
          absolute: true,
          nodir: true,
          ignore: ['ignored/**']
        })
      ).toEqual(
        expect.arrayContaining([join(root, 'client/app.js.map'), join(root, 'style.css.map')])
      );
      expect(
        (
          await glob.glob('**/*.{js,css}.map', {
            cwd: root,
            nodir: true,
            ignore: ['ignored/**']
          })
        ).sort()
      ).toEqual(['client/app.js.map', 'style.css.map']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('resolves fixed historical targets through the installed Babel helper', () => {
    expect(helperRequire.resolve('browserslist')).toBe(require.resolve('browserslist'));
    expect(browsersRequire.resolve('baseline-browser-mapping')).toBe(
      require.resolve('baseline-browser-mapping')
    );
    const helper = helperRequire('@babel/helper-compilation-targets') as {
      default: (
        input: { browsers: string[] },
        options: { ignoreBrowserslistConfig: boolean }
      ) => Record<string, string>;
    };
    const query = ['chrome 120', 'firefox 121', 'safari 17', 'node 20.10.0'];
    expect(browserslist(query)).toEqual([
      'chrome 120',
      'firefox 121',
      'node 20.10.0',
      'safari 17.0'
    ]);
    expect(helper.default({ browsers: query }, { ignoreBrowserslistConfig: true })).toEqual({
      chrome: '120.0.0',
      firefox: '121.0.0',
      safari: '17.0.0',
      node: '20.10.0'
    });
    expect(browserslist(['chrome 120-122', 'firefox 121', 'not chrome 121'])).toEqual([
      'chrome 122',
      'chrome 120',
      'firefox 121'
    ]);
    process.stdout.write(
      `Build query consumer evidence: Node ${process.version}; Babel/Browserslist and both minimatch lines resolved\n`
    );
  });

  it('preserves Baseline public shapes and Browserslist normalization for a fixed year/date', () => {
    const mapping = browsersRequire(
      'baseline-browser-mapping'
    ) as typeof import('baseline-browser-mapping');
    for (const options of [{ targetYear: 2023 }, { widelyAvailableOnDate: '2024-06-01' }]) {
      const result = mapping.getCompatibleVersions(options);
      expect(result).toEqual(getCompatibleVersions(options));
      expect(result.length).toBeGreaterThan(0);
      for (const item of result)
        expect(item).toMatchObject({ browser: expect.any(String), version: expect.any(String) });
    }
    expect(
      mapping
        .getCompatibleVersions({ targetYear: 2023 })
        .map(({ browser, version }) => [browser, version])
    ).toEqual([
      ['chrome', '120'],
      ['chrome_android', '120'],
      ['edge', '120'],
      ['firefox', '121'],
      ['firefox_android', '121'],
      ['safari', '17.2'],
      ['safari_ios', '17.2']
    ]);
    for (const query of ['baseline 2023', 'baseline widely available on 2024-06-01']) {
      const result = browserslist(query);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((target) => /^[a-z_]+ \d[\d.-]*$/.test(target))).toBe(true);
      expect(new Set(result).size).toBe(result.length);
      expect(result).toEqual(browserslist(query));
    }
    const all = mapping.getAllVersions({ outputFormat: 'array' });
    expect(Array.isArray(all)).toBe(true);
    expect(all).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ browser: 'chrome', version: '120', year: 2023 })
      ])
    );
  });

  // Hard deadlines also bound synchronous loops and prove invalid mapping options do not exit Node.
  it.each(['brace-bounds', 'stats', 'query-cache', 'mapping-compatible', 'mapping-all'])(
    'checks %s with small inputs in an isolated child',
    (scenario) => {
      const child = spawnSync(
        process.execPath,
        [
          '--unhandled-rejections=strict',
          fileURLToPath(new URL('./fixtures/build-query-bounded.mjs', import.meta.url)),
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
