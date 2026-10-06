import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import { parseFrontmatter } from 'astro/markdown';
import { stringifyAsync } from 'devalue';
import { load } from 'js-yaml';
import { SourceMapConsumer, SourceNode } from 'source-map-js';

const scenario = process.argv[2];
switch (scenario) {
  case 'async-devalue': {
    await assert.rejects(
      stringifyAsync({
        first: Promise.reject(new Error('first bounded rejection')),
        second: Promise.reject(new Error('second bounded rejection'))
      }),
      /bounded rejection/
    );
    await setImmediate();
    break;
  }
  case 'yaml-budget': {
    // Three empty sources must consume three budget units, not zero.
    const source = 'sources: &sources [{}, {}, {}]\nmerged:\n  <<: *sources\n';
    assert.throws(() => load(source, { maxTotalMergeKeys: 2 }), /merge/i);
    assert.deepEqual(load(source, { maxTotalMergeKeys: 3 }).merged, {});
    break;
  }
  case 'invalid-frontmatter': {
    for (const source of [
      '---\ntags: [unfinished\n---\nBody',
      '+++\ntitle = "unfinished\n+++\nBody',
      '+++\n[[items]\nvalue = 1\n+++\nBody',
      '+++\ndate = 2026-10-06T99:00:00Z\n+++\nBody'
    ])
      assert.throws(() => parseFrontmatter(source));
    break;
  }
  case 'indexed-map': {
    const leaf = {
      version: 3,
      sources: ['input.js'],
      sourcesContent: ['ok;\n'],
      names: [],
      mappings: 'AAAA'
    };
    const section = (line, column = 0, map = leaf) => ({
      version: 3,
      sections: [{ offset: { line, column }, map }]
    });
    // Tiny maps exercise validation without copying huge line gaps into generated output.
    for (const invalid of [-1, 0.5, '1', null]) {
      assert.throws(() => new SourceMapConsumer(section(invalid)), /non-negative integers/);
      assert.throws(() => new SourceMapConsumer(section(0, invalid)), /non-negative integers/);
    }
    assert.throws(() => new SourceMapConsumer(section(10000001)), /must not exceed/);
    assert.throws(
      () => new SourceMapConsumer(section(6000000, 0, section(6000000))),
      /nested sections/
    );
    const consumer = new SourceMapConsumer(section(2));
    assert.deepEqual(consumer.sources, ['input.js']);
    assert.equal(SourceNode.fromStringWithSourceMap('ok;\n', consumer).toString(), 'ok;\n');
    break;
  }
  default:
    throw new Error('Unknown bounded test scenario');
}
process.stdout.write(`${scenario}: passed\n`);
