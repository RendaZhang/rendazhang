import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { lstat, mkdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises';
import { createRequire, findPackageJSON } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const eslintRequire = createRequire(require.resolve('eslint'));
// HumanFS is import-only; resolve its package from ESLint using Node's ESM resolver.
const hfsPackage = findPackageJSON('@humanfs/node', pathToFileURL(require.resolve('eslint')));
const hfsMetadata = JSON.parse(readFileSync(hfsPackage));
const hfsEntry = new URL(hfsMetadata.exports.import.default, pathToFileURL(hfsPackage));
const hfsRequire = createRequire(hfsEntry);
const corePackage = findPackageJSON('@humanfs/core', hfsEntry);
const styleRequire = createRequire(require.resolve('stylelint'));
const astroRequire = createRequire(require.resolve('eslint-plugin-astro'));
const tableRequire = createRequire(styleRequire.resolve('table'));
const yamlRequire = createRequire(require.resolve('yaml-language-server'));
const tableAjvRequire = createRequire(tableRequire.resolve('ajv'));
const yamlAjvRequire = createRequire(yamlRequire.resolve('ajv'));
const uri = tableAjvRequire('fast-uri');
const parser = styleRequire('postcss-selector-parser');
const { NodeHfs } = await import(hfsEntry);
const { ESLint } = eslintRequire('eslint');
const scenario = process.argv[2];
const root = process.argv[3];
const installedVersion = (consumer, name) => {
  let directory = dirname(consumer.resolve(name));
  while (directory !== dirname(directory)) {
    const file = join(directory, 'package.json');
    if (existsSync(file)) {
      const metadata = JSON.parse(readFileSync(file));
      if (metadata.name === name) return metadata.version;
    }
    directory = dirname(directory);
  }
  throw new Error(`Missing installed metadata for ${name}`);
};

switch (scenario) {
  case 'consumer-resolution': {
    for (const [consumer, name, version] of [
      [eslintRequire, 'eslint', '9.39.4'],
      [hfsRequire, '@humanwhocodes/retry', '0.4.3'],
      [styleRequire, 'stylelint', '16.23.1'],
      [styleRequire, 'colord', '2.9.4'],
      [styleRequire, 'postcss-selector-parser', '7.1.6'],
      [astroRequire, 'eslint-plugin-astro', '1.7.0'],
      [tableRequire, 'ajv', '8.20.0'],
      [yamlRequire, 'ajv', '8.20.0'],
      [tableAjvRequire, 'fast-uri', '3.1.8']
    ])
      assert.equal(installedVersion(consumer, name), version);
    assert.equal(hfsMetadata.version, '0.16.8');
    assert.equal(JSON.parse(readFileSync(corePackage)).version, '0.19.2');
    assert.equal((await import('@humanfs/node')).NodeHfs, NodeHfs);
    const coreRequire = createRequire(corePackage);
    assert.equal(hfsRequire('@humanfs/types/package.json').version, '0.15.0');
    assert.equal(
      coreRequire.resolve('@humanfs/types/package.json'),
      hfsRequire.resolve('@humanfs/types/package.json')
    );
    assert.equal(
      hfsRequire.resolve('@humanwhocodes/retry'),
      eslintRequire.resolve('@humanwhocodes/retry')
    );
    assert.notEqual(tableRequire.resolve('ajv'), yamlRequire.resolve('ajv'));
    assert.equal(tableAjvRequire.resolve('fast-uri'), yamlAjvRequire.resolve('fast-uri'));
    assert.equal(
      styleRequire.resolve('postcss-selector-parser'),
      astroRequire.resolve('postcss-selector-parser')
    );
    const specificityRequire = createRequire(
      styleRequire.resolve('@csstools/selector-specificity')
    );
    assert.equal(
      specificityRequire.resolve('postcss-selector-parser'),
      styleRequire.resolve('postcss-selector-parser')
    );
    break;
  }
  case 'humanfs-walk': {
    await mkdir(join(root, 'nested'));
    await writeFile(join(root, 'ok.js'), 'const value = 1; void value;\n');
    await writeFile(join(root, 'nested/bad.js'), 'missingName();\n');
    await writeFile(join(root, 'notes.txt'), 'not JavaScript\n');
    const entries = [];
    for await (const entry of new NodeHfs().walk(root)) entries.push(entry.path);
    assert.deepEqual(entries.sort(), ['nested', 'nested/bad.js', 'notes.txt', 'ok.js']);
    const lint = new ESLint({
      cwd: root,
      overrideConfigFile: true,
      overrideConfig: [{ files: ['**/*.js'], rules: { 'no-undef': 'error' } }]
    });
    const results = await lint.lintFiles(['**/*.js']);
    assert.equal(results.length, 2);
    assert.deepEqual(
      results.flatMap((result) => result.messages.map((message) => message.ruleId)),
      ['no-undef']
    );
    break;
  }
  case 'humanfs-copy':
  case 'humanfs-copy-all': {
    const src = join(root, 'src');
    const dst = join(root, 'dst');
    await mkdir(join(src, 'nested'), { recursive: true });
    await mkdir(join(root, 'sibling'));
    await writeFile(join(root, 'sentinel.txt'), 'synthetic sentinel\n');
    await writeFile(join(root, 'sibling/value.txt'), 'synthetic directory\n');
    await writeFile(join(src, 'regular.txt'), 'regular\n');
    await writeFile(join(src, 'nested/child.txt'), 'recursive\n');
    await symlink('../sentinel.txt', join(src, 'file-link'));
    await symlink('../sibling', join(src, 'directory-link'), 'dir');
    await symlink('../../sentinel.txt', join(src, 'nested/file-link'));
    const hfs = new NodeHfs();
    if (scenario === 'humanfs-copy') {
      await mkdir(dst);
      for (const name of ['regular.txt', 'file-link', 'directory-link'])
        await hfs.copy(join(src, name), join(dst, name));
    } else {
      await hfs.copyAll(src, dst);
      assert.equal(await readFile(join(dst, 'nested/child.txt'), 'utf8'), 'recursive\n');
      assert.ok((await lstat(join(dst, 'nested/file-link'))).isSymbolicLink());
      assert.equal(await readlink(join(dst, 'nested/file-link')), '../../sentinel.txt');
    }
    assert.ok((await lstat(join(dst, 'regular.txt'))).isFile());
    assert.equal(await readFile(join(dst, 'regular.txt'), 'utf8'), 'regular\n');
    // Inspect the links themselves. Preserving a link is not a containment guarantee.
    for (const [name, target] of [
      ['file-link', '../sentinel.txt'],
      ['directory-link', '../sibling']
    ]) {
      assert.ok((await lstat(join(dst, name))).isSymbolicLink());
      assert.equal(await readlink(join(dst, name)), target);
      assert.equal(await readlink(join(src, name)), target);
    }
    assert.equal(await readFile(join(root, 'sentinel.txt'), 'utf8'), 'synthetic sentinel\n');
    assert.equal(await readFile(join(root, 'sibling/value.txt'), 'utf8'), 'synthetic directory\n');
    break;
  }
  case 'ajv-table':
  case 'ajv-yaml': {
    const Ajv = (scenario === 'ajv-table' ? tableRequire : yamlRequire)('ajv');
    const ajv = new Ajv({ strict: true });
    ajv.addSchema({ $id: 'https://example.test/schema/value.json', type: 'integer', minimum: 1 });
    const validate = ajv.compile({
      $id: 'https://example.test/schema/main.json',
      type: 'object',
      properties: { value: { $ref: './value.json' } },
      required: ['value'],
      additionalProperties: false
    });
    assert.equal(validate({ value: 2 }), true);
    for (const value of [{ value: 0 }, { value: '2' }, {}, { value: 2, extra: true }])
      assert.equal(validate(value), false);
    assert.throws(
      () => ajv.compile({ $ref: 'https://example.test/not-loaded.json' }),
      /resolve reference/
    );
    break;
  }
  // Small inert variants of fast-uri's tagged security/normalization regression cases.
  case 'uri-idn': {
    const resolved = uri.resolve('https://trusted.example/base', '//ex\u00ADample.test/child');
    assert.equal(resolved, 'https://example.test/child');
    assert.equal(uri.parse(resolved).host, 'example.test');
    assert.equal(
      uri.resolve('https://example.test/base/', '../child#Part'),
      'https://example.test/child#Part'
    );
    assert.throws(
      () => uri.resolve('https://example.test/', '//\u200D.example/'),
      /converted to ASCII/
    );
    break;
  }
  case 'uri-ipv6': {
    for (const value of ['http://[::not-valid]/x', 'http://[1::2::3]/x', 'http://[fe80/x']) {
      assert.equal(uri.parse(value).error, 'URI host is malformed.');
      assert.equal(uri.normalize(value), value);
      assert.equal(uri.equal(value, value), false);
      assert.throws(() => uri.resolve(value, 'child'), /host is malformed/);
    }
    assert.equal(uri.normalize('http://[2001:0DB8::0001]/'), 'http://[2001:db8::1]/');
    break;
  }
  case 'uri-percent': {
    for (const value of [
      'http://%2565xample.test/',
      '//example%252etest/x',
      'x://host%2540other/'
    ]) {
      assert.equal(uri.normalize(value), value);
      assert.equal(uri.normalize(uri.normalize(value)), value);
    }
    assert.equal(uri.equal('x://%2565xample.test/', 'x://example.test/'), false);
    assert.equal(
      uri.serialize({ scheme: 'x', host: '%2565xample.test', path: '/' }),
      'x://%2565xample.test/'
    );
    assert.equal(
      uri.serialize(uri.parse('http://example.test/a%3Ab%2Fc')),
      'http://example.test/a%3Ab%2Fc'
    );
    assert.equal(uri.equal('http://example.test/a%2Fb', 'http://example.test/a/b'), false);
    break;
  }
  case 'uri-scheme': {
    assert.equal(uri.normalize('ht%74ps://example.test:443'), 'https://example.test/');
    for (const value of ['%2f%2fother.example:/x', 'foo%3Abar:value', '1http://example.test/']) {
      assert.equal(uri.parse(value).error, 'URI scheme is malformed.');
      assert.equal(uri.normalize(value), value);
      assert.equal(uri.equal(value, value), false);
      assert.throws(() => uri.resolve('https://example.test/', value), /scheme is malformed/);
    }
    assert.throws(
      () => uri.serialize({ scheme: '%2f%2fother.example', path: '/x' }),
      /scheme is malformed/
    );
    break;
  }
  case 'uri-authority': {
    for (const port of ['80@other.example', '80/path', -1]) {
      assert.throws(
        () => uri.serialize({ scheme: 'http', host: 'example.test', port, path: '/' }),
        /port is malformed/
      );
    }
    for (const value of [
      'http://example.test:65536/x',
      'http://example.test:99999/x',
      'http://user@]example.test/x'
    ]) {
      assert.ok(uri.parse(value).error);
      assert.equal(uri.normalize(value), value);
      assert.equal(uri.equal(value, value), false);
    }
    assert.equal(
      uri.serialize({ scheme: 'https', host: 'example.test', port: 8443, path: '/x' }),
      'https://example.test:8443/x'
    );
    break;
  }
  case 'uri-host-case': {
    assert.equal(uri.parse('//%45xample.test').host, 'example.test');
    assert.equal(uri.normalize('//%45xample.test'), '//example.test');
    assert.equal(uri.equal('//%45xample.test/x', '//example.test/x'), true);
    assert.equal(uri.equal('HTTP://EXAMPLE.TEST/x', 'http://example.test/x'), true);
    for (const suffix of ['/Path', '/?Key=Value', '/#Part'])
      assert.equal(
        uri.equal(`http://example.test${suffix}`, `http://example.test${suffix.toLowerCase()}`),
        false
      );
    break;
  }
  case 'color-parsers': {
    const { colord, extend, getFormat } = styleRequire('colord');
    extend(['hwb', 'lch', 'cmyk'].map((name) => styleRequire(`colord/plugins/${name}`)));
    for (const value of [
      'rgb(+12, 20, 30)',
      'rgba(12.5, 20, 30, .5)',
      'hsl(-30, 50%, 50%)',
      'hsla(120, 50%, 50%, .5)',
      'hwb(120 10% 20% / .5)',
      'lch(50% 20 30 / .5)',
      'device-cmyk(0% 20% 30% 10% / .5)'
    ]) {
      assert.equal(colord(value).isValid(), true, value);
      assert.ok(getFormat(value));
      assert.equal(colord(colord(value).toRgbString()).isValid(), true);
    }
    assert.equal(colord('rgba(12, 20, 30, .5)').alpha(), 0.5);
    for (const value of [
      '',
      'not-a-color',
      'rgb(1, 2)',
      'hsl(nope)',
      ...['rgb', 'hsl', 'hwb', 'lch', 'device-cmyk'].map((name) => `${name}(${'1'.repeat(96)}!`)
    ]) {
      assert.equal(colord(value).isValid(), false, value);
      assert.equal(getFormat(value), undefined);
    }
    break;
  }
  case 'stylelint-colors': {
    const { default: stylelint } = await import(pathToFileURL(require.resolve('stylelint')));
    const result = await stylelint.lint({
      code: '.ok {color: #abc; background: rgb(12 20 30 / 50%)} .bad {color: #ggg; background: red}',
      config: { rules: { 'color-no-invalid-hex': true, 'color-named': 'never' } }
    });
    assert.deepEqual(result.results[0].warnings.map((w) => w.rule).sort(), [
      'color-named',
      'color-no-invalid-hex'
    ]);
    break;
  }
  case 'selector-ast': {
    const input = String.raw`#main > .item[data-kind="safe"]:not(.off) + .icon\:active, .a ~ .b`;
    const ast = parser().astSync(input);
    assert.equal(ast.toString(), input);
    const classes = [];
    ast.walkClasses((node) => classes.push(node.value));
    assert.deepEqual(classes, ['item', 'off', 'icon:active', 'a', 'b']);
    const attrs = [];
    ast.walkAttributes((node) => attrs.push([node.attribute, node.operator, node.value]));
    assert.deepEqual(attrs, [['data-kind', '=', 'safe']]);
    for (const invalid of ['a[href', ':not(', 'a|'])
      assert.throws(() => parser().astSync(invalid), Error);
    const replacement = parser().astSync(':is(.kept)');
    replacement.walkPseudos((node) => node.replaceWith(node.nodes));
    assert.equal(replacement.toString(), '.kept');
    break;
  }
  case 'selector-bounds': {
    for (const atom of ['.a', '#a']) {
      const input = atom.repeat(128);
      const ast = parser().astSync(input);
      assert.equal(ast.first.nodes.length, 128);
      assert.equal(ast.toString(), input);
    }
    const input = ':not('.repeat(8) + 'a' + ')'.repeat(8);
    assert.equal(parser().processSync(input, { maxNestingDepth: 32 }), input);
    const controlled = (error) =>
      error instanceof Error && !(error instanceof RangeError) && /nesting/i.test(error.message);
    assert.throws(() => parser().astSync(input, { maxNestingDepth: 4 }), controlled);
    const ast = parser().astSync(input);
    assert.throws(() => ast.toString({ maxNestingDepth: 4 }), controlled);
    break;
  }
  case 'lint-selectors': {
    const { default: stylelint } = await import(pathToFileURL(require.resolve('stylelint')));
    const result = await stylelint.lint({
      code: '.ok:is(.child) > [data-kind="safe"] {color: red} #bad {color: red}',
      config: { rules: { 'selector-max-id': 0, 'selector-class-pattern': '^[a-z]+$' } }
    });
    assert.deepEqual(
      result.results[0].warnings.map((w) => w.rule),
      ['selector-max-id']
    );
    const astro = astroRequire('eslint-plugin-astro');
    const lint = new ESLint({
      cwd: root,
      overrideConfigFile: true,
      overrideConfig: [
        {
          files: ['**/*.astro'],
          languageOptions: { parser: require('astro-eslint-parser') },
          plugins: { astro },
          rules: { 'astro/no-unused-css-selector': 'error' }
        }
      ]
    });
    const results = await lint.lintText(
      '<main class="used"><span data-kind="safe">Text</span></main><style>.used > span[data-kind="safe"] {color:red}.missing {color:blue}</style>',
      { filePath: 'fixture.astro' }
    );
    assert.deepEqual(
      results[0].messages.map((m) => [m.ruleId, m.messageId]),
      [['astro/no-unused-css-selector', 'unused']]
    );
    assert.match(results[0].messages[0].message, /\.missing/);
    break;
  }
  default:
    throw new Error(`Unknown scenario: ${scenario}`);
}
process.stdout.write(`${scenario}: after-checks\n`);
