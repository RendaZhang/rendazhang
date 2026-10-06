import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const astroRoot = dirname(require.resolve('astro/package.json'));
const astroRequire = createRequire(join(astroRoot, 'dist/assets/svg/svgo.js'));
const svgoRoot = dirname(dirname(astroRequire.resolve('svgo')));
const svgoRequire = createRequire(join(svgoRoot, 'lib/svgo-node.js'));
const { svgoOptimizer } = await import(pathToFileURL(join(astroRoot, 'dist/assets/svg/svgo.js')));
const { parseSvgComponentData } = await import(
  pathToFileURL(join(astroRoot, 'dist/assets/svg/utils.js'))
);
const { optimize } = await import(pathToFileURL(join(svgoRoot, 'lib/svgo-node.js')));
const svgNS = 'http://www.w3.org/2000/svg';
const windows = [];
const xml = (body, attrs = '') =>
  `<svg xmlns="${svgNS}" viewBox="0 0 10 10" ${attrs}>${body}</svg>`;
const parse = (source) => {
  // No runScripts/resources option: output is inspected as XML, never rendered or loaded.
  const dom = new JSDOM(source, { contentType: 'image/svg+xml' });
  windows.push(dom.window);
  return dom.window.document;
};
const removed = (source) => parse(optimize(source, { plugins: ['removeScripts'] }).data);
const meta = { fsPath: 'fixture.svg' };
const scenario = process.argv[2];
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

try {
  switch (scenario) {
    case 'consumer-resolution': {
      assert.equal(JSON.parse(readFileSync(join(svgoRoot, 'package.json'))).version, '4.1.0');
      assert.equal(astroRequire.resolve('svgo'), require.resolve('svgo'));
      for (const [name, version] of [
        ['css-select', '6.0.0'],
        ['css-what', '7.0.0'],
        ['sax', '1.6.1']
      ]) {
        assert.equal(svgoRequire(`${name}/package.json`).version, version);
      }
      const selectRequire = createRequire(svgoRequire.resolve('css-select'));
      assert.equal(selectRequire.resolve('css-what'), svgoRequire.resolve('css-what'));
      for (const [name, version] of [
        ['boolbase', '1.0.0'],
        ['domhandler', '5.0.3'],
        ['domutils', '3.2.2'],
        ['nth-check', '2.1.1']
      ]) {
        assert.equal(installedVersion(selectRequire, name), version);
      }
      const whatRoot = dirname(svgoRequire.resolve('css-what/package.json'));
      const esmWhat = await import(pathToFileURL(join(whatRoot, 'dist/esm/index.js')));
      assert.deepEqual(
        esmWhat.parse('g > rect.mark[data-kind="keep"]'),
        svgoRequire('css-what').parse('g > rect.mark[data-kind="keep"]')
      );
      const sample = xml('<rect width="5" height="6"/><text x="1" y="8">Safe</text>');
      assert.equal(optimize(sample).data, astroRequire('svgo').optimize(sample).data);
      assert.doesNotMatch(
        readFileSync(new URL('../../../astro.config.ts', import.meta.url), 'utf8'),
        /svgOptimizer|removeScripts/
      );
      break;
    }
    case 'astro-wrapper': {
      const logo = readFileSync(
        new URL('../../assets/social/medium-logo.svg', import.meta.url),
        'utf8'
      );
      const original = parse(logo);
      const optimized = parse(svgoOptimizer().optimize(logo, 'medium-logo.svg'));
      assert.equal(
        optimized.documentElement.getAttribute('viewBox'),
        original.documentElement.getAttribute('viewBox')
      );
      assert.ok(optimized.querySelector('path[d],ellipse,rect,circle'));
      const sample = xml('<rect width="5" height="6"/><text x="1" y="8">Safe</text>');
      for (const config of [undefined, { plugins: ['removeComments'] }]) {
        const optimizer = svgoOptimizer(config);
        const doc = parse(optimizer.optimize(sample, meta.fsPath));
        assert.equal(doc.documentElement.getAttribute('viewBox'), '0 0 10 10');
        assert.equal(doc.querySelector('text').textContent, 'Safe');
        assert.ok(doc.querySelector('path[d],rect[width="5"][height="6"]'));
        const component = await parseSvgComponentData(meta, sample, optimizer);
        assert.equal(component.attributes.viewBox, '0 0 10 10');
        assert.match(component.children, /Safe/);
      }
      break;
    }
    case 'xast-selectors': {
      const selectors = [
        ['.mark[data-kind="keep"]', ['first']],
        ['g > rect', ['first', 'second']],
        ['rect + circle', ['round']],
        ['rect ~ rect', ['second']],
        ['rect:first-child', ['first']],
        ['.missing', []]
      ];
      const body =
        '<g><rect id="first" class="mark" data-kind="keep" width="2" height="3"/><circle id="round" r="1"/><rect id="second" width="1" height="1"/></g><path id="outside" d="M0 0h1"/>';
      const { parseSvg } = await import(pathToFileURL(join(svgoRoot, 'lib/parser.js')));
      const { createAdapter } = await import(
        pathToFileURL(join(svgoRoot, 'lib/svgo/css-select-adapter.js'))
      );
      const { querySelectorAll } = await import(pathToFileURL(join(svgoRoot, 'lib/xast.js')));
      const selectRoot = dirname(svgoRequire.resolve('css-select/package.json'));
      const esmSelect = await import(pathToFileURL(join(selectRoot, 'dist/esm/index.js')));
      const cjsSelect = svgoRequire('css-select');
      for (const [selector, expected] of selectors) {
        const tree = parseSvg(xml(body));
        for (const select of [esmSelect, cjsSelect]) {
          assert.deepEqual(
            select
              .selectAll(selector, tree, { xmlMode: true, adapter: createAdapter(tree) })
              .map((n) => n.attributes.id),
            expected
          );
        }
        assert.deepEqual(
          querySelectorAll(tree, selector).map((n) => n.attributes.id),
          expected
        );
        const doc = parse(
          optimize(xml(`<style>${selector}{fill:red}</style>${body}`), {
            plugins: [
              {
                name: 'inlineStyles',
                params: { onlyMatchedOnce: false, removeMatchedSelectors: false }
              }
            ]
          }).data
        );
        for (const id of ['first', 'round', 'second', 'outside']) {
          assert.equal(
            doc.getElementById(id).getAttribute('style'),
            expected.includes(id) ? 'fill:red' : null
          );
        }
        assert.equal(doc.getElementById('outside').getAttribute('d'), 'M0 0h1');
      }
      break;
    }
    case 'invalid-xml': {
      for (const reference of ['&#1;', '&#xB;', '&#x1F;', '&#xD800;', '&#xFFFF;', '&#x110000;']) {
        for (const body of [`<text>${reference}</text>`, `<rect data-value="${reference}"/>`]) {
          const source = xml(body);
          assert.throws(() => optimize(source), { name: 'SvgoParserError' });
          assert.throws(
            () => svgoOptimizer().optimize(source, meta.fsPath),
            /Invalid character entity/
          );
          await assert.rejects(parseSvgComponentData(meta, source, svgoOptimizer()), (error) => {
            assert.equal(error.name, 'CannotOptimizeSvg');
            assert.equal(error.cause.name, 'SvgoParserError');
            return true;
          });
        }
      }
      break;
    }
    case 'valid-unicode': {
      for (const point of [0x20, 0xd7ff, 0xe000, 0xfffd, 0x10000, 0x10ffff]) {
        const reference = `&#x${point.toString(16)};`;
        const doc = parse(
          svgoOptimizer({ plugins: [] }).optimize(
            xml(`<text data-value="${reference}">${reference}</text>`),
            meta.fsPath
          )
        );
        assert.equal(doc.querySelector('text').textContent, String.fromCodePoint(point));
        assert.equal(
          doc.querySelector('text').getAttribute('data-value'),
          String.fromCodePoint(point)
        );
      }
      break;
    }
    case 'foreign-object': {
      const doc = removed(
        xml(`<foreignObject width="10" height="10"><div xmlns="http://www.w3.org/1999/xhtml" id="html" onload="void 0" onbeforetoggle="void 0">
        <p>Safe HTML</p><iframe id="frame" srcdoc="&lt;p&gt;not loaded&lt;/p&gt;"/>
        <form id="form" action="javascript:void 0"><button id="button" formaction="vbscript:0">Safe button</button></form>
        <object id="object" data="data:text/html,inert"/><img id="image" src="javascript:void 0"/>
        <a id="unsafe" href="javascript:void 0">Safe label</a><a id="safe" href="https://example.com/docs">Safe link</a>
        <script>void 0</script></div></foreignObject><rect width="2" height="3"/>`)
      );
      for (const element of doc.querySelectorAll('*')) {
        for (const attribute of element.attributes) assert.ok(!/^on/i.test(attribute.localName));
      }
      for (const [id, attr] of [
        ['frame', 'srcdoc'],
        ['form', 'action'],
        ['button', 'formaction'],
        ['object', 'data'],
        ['image', 'src']
      ]) {
        assert.equal(doc.getElementById(id).hasAttribute(attr), false);
      }
      assert.equal(doc.querySelector('script'), null);
      assert.equal(doc.querySelector('[href^="javascript:"]'), null);
      assert.equal(doc.getElementById('safe').getAttribute('href'), 'https://example.com/docs');
      assert.match(doc.querySelector('foreignObject').textContent, /Safe HTML/);
      assert.match(doc.querySelector('foreignObject').textContent, /Safe button/);
      assert.equal(doc.querySelector('rect').getAttribute('width'), '2');
      break;
    }
    case 'namespace-links': {
      const doc = removed(
        xml(
          `<s:a id="bad1" href="java&#9;script:void 0"><text id="label1">Kept one</text></s:a>
        <s:a id="bad2" xlink:href="java&#10;&#13;script:void 0"><rect id="shape" width="2" height="3"/></s:a>
        <s:a id="safe" href="/docs/"><text>Safe</text></s:a><custom:a id="custom" href="javascript:void 0"/>`,
          `xmlns:s="${svgNS}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:custom="urn:local-test"`
        )
      );
      assert.equal(doc.getElementById('bad1'), null);
      assert.equal(doc.getElementById('bad2'), null);
      assert.equal(doc.getElementById('label1').textContent, 'Kept one');
      assert.equal(doc.getElementById('shape').getAttribute('height'), '3');
      assert.equal(doc.getElementById('safe').getAttribute('href'), '/docs/');
      // Custom namespace semantics are deliberately outside this plugin's sanitizer claim.
      assert.equal(doc.getElementById('custom').getAttribute('href'), 'javascript:void 0');
      break;
    }
    case 'data-urls': {
      const png = 'data:image/png;base64,iVBORw0KGgo=';
      const doc = removed(
        xml(
          ['text/html', 'application/xhtml+xml', 'image/svg+xml']
            .map(
              (type, i) =>
                `<a id="bad${i}" href="data:${type},inert"><text id="text${i}">Kept ${i}</text></a>`
            )
            .join('') +
            `<a id="png" href="${png}"><text>PNG</text></a><a id="safe" href="#target"><text>Local</text></a><rect id="target" width="2" height="3"/>`
        )
      );
      for (let i = 0; i < 3; i++) {
        assert.equal(doc.getElementById(`bad${i}`), null);
        assert.equal(doc.getElementById(`text${i}`).textContent, `Kept ${i}`);
      }
      assert.equal(doc.getElementById('png').getAttribute('href'), png);
      assert.equal(doc.getElementById('safe').getAttribute('href'), '#target');
      break;
    }
    default:
      throw new Error('Unknown bounded SVG scenario');
  }
} finally {
  for (const window of windows) window.close();
}
process.stdout.write(`${scenario}: after-checks\n`);
