// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { isFrontmatterValid, parseFrontmatter } from 'astro/markdown';
import * as devalue from 'devalue';
import * as toml from 'smol-toml';
import postcss from 'postcss';
import { SourceMapConsumer, SourceMapGenerator } from 'source-map-js';

const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const helperRequire = createRequire(astroRequire.resolve('@astrojs/internal-helpers/frontmatter'));

describe('build data dependency compatibility', () => {
  it('tests the same installed nodes used by Astro, React integration and PostCSS', () => {
    const reactRequire = createRequire(require.resolve('@astrojs/react'));
    const postcssRequire = createRequire(require.resolve('postcss'));
    expect(astroRequire.resolve('devalue')).toBe(require.resolve('devalue'));
    expect(reactRequire.resolve('devalue')).toBe(require.resolve('devalue'));
    for (const name of ['js-yaml', 'smol-toml']) {
      expect(helperRequire.resolve(name)).toBe(require.resolve(name));
      expect(astroRequire.resolve(name)).toBe(require.resolve(name));
    }
    expect(postcssRequire.resolve('source-map-js')).toBe(require.resolve('source-map-js'));
    process.stdout.write(
      `Build data consumer evidence: Node ${process.version}; Astro frontmatter, devalue and PostCSS use the reviewed shared nodes\n`
    );
  });

  it('round-trips build data, dates, collections, repeated references and small sparse arrays', () => {
    const record = Object.assign(Object.create(null), { title: 'Public \u6587\u6863' });
    const sparse = new Array<string>(8);
    sparse[7] = 'last';
    const input = {
      record,
      again: record,
      date: new Date('2026-10-06T00:00:00Z'),
      map: new Map([['route', '/docs/']]),
      set: new Set(['en', 'zh']),
      text: '</script>\u2028\u2029',
      count: 3n,
      sparse
    };
    const serialized = devalue.stringify(input);
    for (const result of [devalue.parse(serialized), devalue.unflatten(JSON.parse(serialized))]) {
      expect(result).toEqual(input);
      expect(result.record).toBe(result.again);
      expect(Object.getPrototypeOf(result.record)).toBeNull();
      expect(Object.hasOwn(result.sparse, 0)).toBe(false);
      expect(result.sparse.length).toBe(8);
    }
    expect(serialized).not.toContain('</script>');
    const sparseSource = devalue.uneval(sparse);
    expect(sparseSource).toContain('last');
    expect(sparseSource.length).toBeLessThan(200);
  });

  it('serializes React integration-style options without evaluating generated JavaScript', () => {
    const source = devalue.uneval({
      identifierPrefix: '</script>',
      experimentalReactChildren: true
    });
    expect(source).toContain('identifierPrefix:');
    expect(source).toContain('experimentalReactChildren:true');
    expect(source).not.toContain('</script>');
    const repeated = ['public', 'public', 3n, 3n];
    expect(devalue.parse(devalue.stringify(repeated))).toEqual(repeated);
    expect(devalue.uneval(repeated).length).toBeLessThan(200);
  });

  it('serializes only the visible bytes of a small Buffer view', async () => {
    const backing = Buffer.alloc(16, 255);
    backing.set([1, 2, 3], 4);
    const view = backing.subarray(4, 7);
    for (const serialized of [devalue.stringify(view), await devalue.stringifyAsync(view)]) {
      const result = devalue.parse(serialized) as Uint8Array;
      expect([...result]).toEqual([1, 2, 3]);
      expect(result.buffer.byteLength).toBe(3);
    }
    expect(devalue.uneval(view)).toBe('new Uint8Array([1,2,3])');
  });

  it('rejects bounded malformed data, non-string keys and invalid revived backing buffers', () => {
    expect(() => devalue.parse('[')).toThrow();
    const invalidKey = '[["null",0,1],"value"]';
    expect(() => devalue.parse(invalidKey)).toThrow(/non-string key/);
    expect(() => devalue.unflatten(JSON.parse(invalidKey))).toThrow(/non-string key/);
    expect(() =>
      devalue.parse('[["Uint8Array",1],["ArrayBuffer",2],8]', {
        ArrayBuffer: (value) => value
      })
    ).toThrow(TypeError);
    expect(() => devalue.stringify(() => 'not data')).toThrow();
  });

  it.each([
    [
      'YAML',
      '---',
      'title: "Public \u6587\u6863"\ntags: [en, zh]\npublished: 2026-10-06T00:00:00Z\nnested:\n  enabled: true'
    ],
    [
      'TOML',
      '+++',
      'title = "Public \u6587\u6863"\ntags = ["en", "zh"]\npublished = 2026-10-06T00:00:00Z\n[nested]\nenabled = true'
    ]
  ])('preserves %s frontmatter data and Astro content modes', (_name, delimiter, data) => {
    const header = `${delimiter}\n${data}\n${delimiter}`;
    const body = '\n# Public body\n\u5185\u5bb9\n';
    const source = header + body;
    const parsed = parseFrontmatter(source);
    expect(parsed.frontmatter).toMatchObject({
      title: 'Public \u6587\u6863',
      tags: ['en', 'zh'],
      nested: { enabled: true }
    });
    expect(parsed.frontmatter.published).toBeInstanceOf(Date);
    expect(parsed.frontmatter.published.toISOString()).toBe('2026-10-06T00:00:00.000Z');
    expect(isFrontmatterValid(parsed.frontmatter)).toBe(true);
    expect(parsed.content).toBe(body);
    expect(parsed.rawFrontmatter).toBe(`\n${data}\n`);
    expect(parseFrontmatter(source, { frontmatter: 'preserve' }).content).toBe(source);
    expect(parseFrontmatter(source, { frontmatter: 'empty-with-spaces' }).content).toBe(
      header.replace(/[^\r\n]/g, ' ') + body
    );
    expect(parseFrontmatter(source, { frontmatter: 'empty-with-lines' }).content).toBe(
      header.replace(/[^\r\n]/g, '') + body
    );
    expect(parseFrontmatter(body).content).toBe(body);
  });

  it('keeps TOML null-prototype records compatible with own properties, spread, JSON and legacy dates', () => {
    const source = 'title = "Public"\ndate = 2026-10-06\n[nested]\nenabled = true';
    const parsed = toml.parse(source);
    const frontmatter = parseFrontmatter(`+++\n${source}\n+++\nBody`).frontmatter;
    for (const value of [parsed, frontmatter]) {
      expect(Object.getPrototypeOf(value)).toBeNull();
      expect(Object.getPrototypeOf(value.nested)).toBeNull();
      expect(Object.hasOwn(value, 'title')).toBe(true);
      expect(Object.hasOwn(value, 'missing')).toBe(false);
      expect({ ...value }.title).toBe('Public');
      expect(JSON.parse(JSON.stringify(value))).toEqual({
        title: 'Public',
        date: '2026-10-06',
        nested: { enabled: true }
      });
      expect(value.date).toBeInstanceOf(toml.TomlDate);
      expect(isFrontmatterValid(value)).toBe(true);
    }
    expect(toml.parse(toml.stringify(parsed))).toEqual(parsed);
  });

  it('round-trips a tiny generated source map with original content', () => {
    const generator = new SourceMapGenerator({ file: 'output.css' });
    generator.addMapping({
      generated: { line: 1, column: 0 },
      original: { line: 2, column: 0 },
      source: 'input.css'
    });
    generator.setSourceContent('input.css', '\na { color: red; }');
    const consumer = new SourceMapConsumer(generator.toJSON());
    expect(consumer.originalPositionFor({ line: 1, column: 0 })).toMatchObject({
      source: 'input.css',
      line: 2,
      column: 0
    });
    expect(consumer.sourceContentFor('input.css')).toBe('\na { color: red; }');
    expect(SourceMapGenerator.fromSourceMap(consumer).toJSON()).toMatchObject({
      sources: ['input.css'],
      mappings: 'AACA'
    });
  });

  it('preserves original positions when PostCSS consumes its previous map', async () => {
    const input = 'a {\n  color: red;\n}\n';
    const first = await postcss([
      {
        postcssPlugin: 'test-color',
        Declaration(decl) {
          if (decl.prop === 'color') decl.value = 'blue';
        }
      }
    ]).process(input, {
      from: 'input.css',
      to: 'intermediate.css',
      map: { inline: false, annotation: false }
    });
    expect(first.map).toBeDefined();
    const second = await postcss([]).process(first.css, {
      from: 'intermediate.css',
      to: 'output.css',
      map: { prev: first.map!.toJSON(), inline: false, annotation: false }
    });
    const consumer = new SourceMapConsumer(second.map!.toJSON());
    expect(second.css).toContain('color: blue');
    expect(consumer.originalPositionFor({ line: 2, column: 2 })).toMatchObject({
      source: 'input.css',
      line: 2,
      column: 2
    });
    expect(consumer.sourceContentFor('input.css')).toBe(input);
  });

  // A child-process deadline still stops a synchronous parser regression that Vitest cannot interrupt.
  it.each(['async-devalue', 'yaml-budget', 'invalid-frontmatter', 'indexed-map'])(
    'checks bounded %s input in hard-timeout isolation',
    (scenario) => {
      const child = spawnSync(
        process.execPath,
        [
          '--unhandled-rejections=strict',
          fileURLToPath(new URL('./fixtures/build-data-bounded.mjs', import.meta.url)),
          scenario
        ],
        { encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 64 * 1024 }
      );
      expect(child.error, child.stderr).toBeUndefined();
      expect(child.signal, child.stderr).toBeNull();
      expect(child.status, child.stderr).toBe(0);
      expect(child.stdout.trim()).toBe(`${scenario}: passed`);
    },
    10000
  );
});
