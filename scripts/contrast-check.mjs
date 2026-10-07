import fs from 'node:fs';
import postcss from 'postcss';
import { converter, parse } from 'culori';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import selectorParser from 'postcss-selector-parser';

const rgb = converter('rgb');
const sources = ['tokens.css', '_gradients.css', 'theme-tokens.css'].map((file) =>
  postcss.parse(fs.readFileSync(`src/styles/core/${file}`, 'utf8'))
);

// Read the actual root cascade, including modern OKLCH declarations.
// Browser checks cover page-local aliases and rendered state composites.
export function rootTokens(mode, palette, roots = sources) {
  const document = new JSDOM('<!doctype html><html></html>').window.document;
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.palette = palette;
  const tokens = new Map();
  const ranks = new Map();
  // Root-token selectors are compounds, not descendant/component selectors.
  // Match real selectors and honor specificity before source order, including comma lists.
  for (const source of roots) {
    source.walkRules((rule) => {
      const selectors = selectorParser().astSync(rule.selector).nodes;
      const matching = selectors.filter((selector) => root.matches(selector.toString()));
      for (const selector of matching) {
        assert(
          !selector.nodes.some((node) => node.type === 'combinator'),
          'Unsupported root combinator'
        );
        assert(
          !selector.nodes.some((node) => node.type === 'pseudo' && node.value !== ':root'),
          'Extend the root specificity checker before adding functional pseudo-classes'
        );
        const rank = selector.nodes.reduce(
          (score, node) =>
            score +
            (node.type === 'id'
              ? 100
              : ['class', 'attribute', 'pseudo'].includes(node.type)
                ? 10
                : node.type === 'tag'
                  ? 1
                  : 0),
          0
        );
        // Only direct declarations belong to this selector, not nested descendants.
        for (const decl of rule.nodes.filter(
          (node) => node.type === 'decl' && node.prop.startsWith('--')
        )) {
          const priority = rank + (decl.important ? 1000 : 0);
          if (priority >= (ranks.get(decl.prop) ?? -1)) {
            tokens.set(decl.prop, decl.value);
            ranks.set(decl.prop, priority);
          }
        }
      }
    });
  }
  document.defaultView.close();
  function value(key, seen = new Set()) {
    assert(!seen.has(key), `Cyclic token ${key}`);
    assert(tokens.has(key), `Missing token ${key}`);
    return tokens
      .get(key)
      .replace(/var\((--[\w-]+)\)/g, (_, ref) => value(ref, new Set([...seen, key])));
  }
  function color(key) {
    const parsed = rgb(parse(value(key)));
    assert(parsed, `Unsupported color ${key}: ${value(key)}`);
    return parsed;
  }
  return { value, color };
}
function mix(fg, bg, alpha) {
  return Object.fromEntries(['r', 'g', 'b'].map((c) => [c, fg[c] * alpha + bg[c] * (1 - alpha)]));
}
function luminance(color) {
  return ['r', 'g', 'b'].reduce((sum, channel, index) => {
    const c = Math.max(0, Math.min(1, color[channel]));
    return (
      sum +
      [0.2126, 0.7152, 0.0722][index] * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    );
  }, 0);
}
const results = [];
const resolvedSets = {};
function check(name, foreground, background, minimum) {
  const a = luminance(foreground),
    b = luminance(background);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert(ratio >= minimum, `${name}: ${ratio.toFixed(3)} < ${minimum}`);
  results.push({ name, ratio, minimum });
}
for (const palette of ['default', 'aurora', 'forest']) {
  for (const mode of ['light', 'dark']) {
    const { color, value } = rootTokens(mode, palette);
    resolvedSets[`${palette}-${mode}`] = Object.fromEntries(
      [
        'bg',
        'surface',
        'subtle-bg',
        'text',
        'text-muted',
        'brand',
        'primary-hover',
        'primary-active',
        'on-primary',
        'accent',
        'accent-decoration',
        'palette-surface',
        'palette-surface-strong',
        'pressed-surface',
        'focus',
        'border-neutral',
        'success',
        'success-bg',
        'warning',
        'warning-bg',
        'error',
        'error-bg',
        'info',
        'info-bg'
      ].map((role) => [`--color-${role}`, value(`--color-${role}`)])
    );
    for (const base of [
      'bg',
      'surface',
      'subtle-bg',
      'palette-surface',
      'palette-surface-strong',
      'pressed-surface'
    ]) {
      for (const fg of ['text', 'text-muted', 'placeholder', 'brand', 'accent']) {
        check(
          `${palette} ${mode} ${fg}/${base}`,
          color(`--color-${fg}`),
          color(`--color-${base}`),
          4.5
        );
      }
      for (const fg of ['focus', 'border-neutral']) {
        check(
          `${palette} ${mode} ${fg}/${base}`,
          color(`--color-${fg}`),
          color(`--color-${base}`),
          3
        );
      }
    }
    for (const fill of ['brand', 'primary-hover', 'primary-active']) {
      check(
        `${palette} ${mode} on-primary/${fill}`,
        color('--color-on-primary'),
        color(`--color-${fill}`),
        4.5
      );
    }
    for (const state of ['success', 'warning', 'error', 'info']) {
      for (const bg of [`${state}-bg`, 'bg', 'surface', 'subtle-bg']) {
        check(
          `${palette} ${mode} ${state}/${bg}`,
          color(`--color-${state}`),
          color(`--color-${bg}`),
          4.5
        );
      }
    }
    for (const base of ['bg', 'surface']) {
      const composite = mix(color('--color-palette-surface'), color(`--color-${base}`), 0.72);
      check(`${palette} ${mode} composite text/${base}`, color('--color-text'), composite, 4.5);
      check(
        `${palette} ${mode} composite link-hover/${base}`,
        color('--color-primary-hover'),
        composite,
        4.5
      );
    }
    check(
      `${palette} ${mode} disabled`,
      color('--color-disabled-text'),
      color('--color-disabled-bg'),
      4.5
    );
    check(
      `${palette} ${mode} code`,
      color('--color-md-code-color'),
      color('--color-md-code-bg'),
      4.5
    );
    check(
      `${palette} ${mode} comments`,
      color('--color-text-muted'),
      color('--color-md-pre-bg'),
      4.5
    );
    check(
      `${palette} ${mode} hero worst-case`,
      color('--color-base-white'),
      mix(color('--palette-ink-hero'), color('--color-base-white'), 0.62),
      4.5
    );
    assert(value('--focus-ring').includes('0 0 0 5px'));
    assert.equal(value('--color-white'), value('--color-base-white'));
  }
}
console.log(
  JSON.stringify(
    {
      checks: results.length,
      resolvedSets,
      minimumText: Math.min(...results.filter((r) => r.minimum === 4.5).map((r) => r.ratio)),
      results
    },
    null,
    2
  )
);
