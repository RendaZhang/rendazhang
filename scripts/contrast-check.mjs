import fs from 'node:fs';
import postcss from 'postcss';
import { converter, parse } from 'culori';
import assert from 'node:assert/strict';

const rgb = converter('rgb');
const sources = ['tokens.css', '_gradients.css', 'theme-tokens.css'].map((file) =>
  postcss.parse(fs.readFileSync(`src/styles/core/${file}`, 'utf8'))
);

// Read the actual root cascade, including modern OKLCH declarations.
// Browser checks cover page-local aliases and rendered state composites.
function rootTokens(mode, palette) {
  const tokens = new Map();
  for (const source of sources) {
    source.walkRules((rule) => {
      const selector = rule.selector;
      const matches =
        selector === ':root' ||
        selector === `html[data-theme='${mode}']` ||
        selector === `html[data-palette='${palette}']` ||
        (selector.startsWith("html:not([data-palette='aurora']):not([data-palette='forest'])") &&
          palette === 'default' &&
          (!selector.includes('[data-theme=') || mode === 'dark'));
      if (matches) rule.walkDecls(/^--/, (decl) => tokens.set(decl.prop, decl.value));
    });
  }
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
function check(name, foreground, background, minimum) {
  const a = luminance(foreground),
    b = luminance(background);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert(ratio >= minimum, `${name}: ${ratio.toFixed(3)} < ${minimum}`);
  results.push({ name, ratio, minimum });
}
for (const mode of ['light', 'dark']) {
  const { color, value } = rootTokens(mode, 'default');
  for (const base of [
    'bg',
    'surface',
    'subtle-bg',
    'palette-surface',
    'palette-surface-strong',
    'pressed-surface'
  ]) {
    for (const fg of ['text', 'text-muted', 'placeholder', 'brand', 'accent']) {
      check(`Ink ${mode} ${fg}/${base}`, color(`--color-${fg}`), color(`--color-${base}`), 4.5);
    }
    for (const fg of ['focus', 'border-neutral']) {
      check(`Ink ${mode} ${fg}/${base}`, color(`--color-${fg}`), color(`--color-${base}`), 3);
    }
  }
  for (const fill of ['brand', 'primary-hover', 'primary-active']) {
    check(
      `Ink ${mode} on-primary/${fill}`,
      color('--color-on-primary'),
      color(`--color-${fill}`),
      4.5
    );
  }
  for (const state of ['success', 'warning', 'error', 'info']) {
    for (const bg of [`${state}-bg`, 'bg', 'surface', 'subtle-bg']) {
      check(`Ink ${mode} ${state}/${bg}`, color(`--color-${state}`), color(`--color-${bg}`), 4.5);
    }
  }
  for (const base of ['bg', 'surface']) {
    const composite = mix(color('--color-palette-surface'), color(`--color-${base}`), 0.72);
    check(`Ink ${mode} composite text/${base}`, color('--color-text'), composite, 4.5);
    check(
      `Ink ${mode} composite link-hover/${base}`,
      color('--color-primary-hover'),
      composite,
      4.5
    );
  }
  check(`Ink ${mode} disabled`, color('--color-disabled-text'), color('--color-disabled-bg'), 4.5);
  check(`Ink ${mode} code`, color('--color-md-code-color'), color('--color-md-code-bg'), 4.5);
  check(`Ink ${mode} comments`, color('--color-text-muted'), color('--color-md-pre-bg'), 4.5);
  check(
    `Ink ${mode} hero worst-case`,
    color('--color-base-white'),
    mix(color('--palette-ink-hero'), color('--color-base-white'), 0.62),
    4.5
  );
  assert(value('--focus-ring').includes('0 0 0 5px'));
  assert.equal(value('--color-white'), value('--color-base-white'));
}
for (const palette of ['aurora', 'forest']) {
  for (const mode of ['light', 'dark']) {
    const { color, value } = rootTokens(mode, palette);
    for (const fill of ['brand', 'brand-secondary']) {
      check(
        `${palette} ${mode} on-primary/${fill}`,
        color('--color-on-primary'),
        color(`--color-${fill}`),
        4.5
      );
    }
    assert.equal(value('--color-on-primary'), value('--color-base-white'));
    assert(!value('--gradient-primary').includes('#f08072'), 'Ink leaked into legacy palette');
  }
}
console.log(
  JSON.stringify(
    {
      checks: results.length,
      minimumText: Math.min(...results.filter((r) => r.minimum === 4.5).map((r) => r.ratio)),
      results
    },
    null,
    2
  )
);
