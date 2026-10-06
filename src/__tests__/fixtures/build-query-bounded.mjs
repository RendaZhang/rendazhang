import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const helperRequire = createRequire(require.resolve('@babel/helper-compilation-targets'));
const browserslist = helperRequire('browserslist');
const mapping = createRequire(helperRequire.resolve('browserslist'))('baseline-browser-mapping');
const scenario = process.argv[2];

switch (scenario) {
  case 'brace-bounds': {
    for (const parent of ['eslint', 'glob', '@typescript-eslint/typescript-estree']) {
      const consumer = createRequire(require.resolve(parent));
      const matcher = consumer('minimatch');
      const brace = createRequire(consumer.resolve('minimatch'))('brace-expansion');
      const expand = typeof brace === 'function' ? brace : brace.expand;
      assert.deepEqual(matcher.braceExpand('{a'), ['{a']);
      assert.deepEqual(matcher.braceExpand('{{a},b}'), ['{a}', 'b']);
      assert.deepEqual(matcher.braceExpand('{a},b}'), ['a}', 'b']);
      // Lower the guards instead of constructing deep input or an expansion cross-product.
      assert.deepEqual(expand('{{a,b}}', { maxDepth: 0 }), ['{{a,b}}']);
      assert.deepEqual(expand('{a}},b}', { maxRewrites: 0 }), ['{a}},b}']);
      assert.deepEqual(expand('{a,b,c}', { max: 2 }), ['a', 'b']);
    }
    break;
  }
  case 'stats': {
    const before = Object.getOwnPropertyDescriptors(Object.prototype);
    const stats = JSON.parse(
      '{"chrome":{"120":60},"firefox":{"121":40},"__proto__":{"1":3},"constructor":{"1":2}}'
    );
    const snapshot = JSON.stringify(stats);
    assert.deepEqual(browserslist('> 50% in my stats', { stats }), ['chrome 120']);
    assert.deepEqual(browserslist('> 50% in my stats', { stats: { dataByBrowser: stats } }), [
      'chrome 120'
    ]);
    assert.equal(JSON.stringify(stats), snapshot);
    assert.throws(() => browserslist('> 1% in my stats', { stats: { chrome: null } }), TypeError);
    assert.throws(() => browserslist('unrecognized browser query'), /Unknown browser query/);
    assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), before);
    assert.deepEqual(browserslist('chrome 120'), ['chrome 120']);
    break;
  }
  case 'query-cache': {
    delete process.env.BROWSERSLIST_DISABLE_CACHE;
    const first = browserslist('chrome 120');
    assert.equal(browserslist('chrome 120'), first);
    // The reviewed query and parse Maps each cap at 500. This is finite eviction, not a load test.
    for (let i = 1; i <= 501; i++) {
      assert.deepEqual(browserslist('chrome 120' + ' '.repeat(i)), ['chrome 120']);
    }
    const after = browserslist('chrome 120');
    assert.deepEqual(after, first);
    assert.notEqual(after, first);
    assert.equal(browserslist('chrome 120'), after);
    break;
  }
  case 'mapping-compatible':
  case 'mapping-all': {
    const method = scenario === 'mapping-compatible' ? 'getCompatibleVersions' : 'getAllVersions';
    let caught = false;
    try {
      mapping[method]({ includeKaiOS: true, includeDownstreamBrowsers: false });
    } catch (error) {
      assert.ok(error instanceof Error);
      assert.match(error.message, /KaiOS|includeDownstreamBrowsers/i);
      caught = true;
    }
    assert.equal(caught, true);
    assert.ok(mapping.getCompatibleVersions({ targetYear: 2023 }).length > 0);
    break;
  }
  default:
    throw new Error('Unknown bounded query scenario');
}
process.stdout.write(`${scenario}: after-checks\n`);
