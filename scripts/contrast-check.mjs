import fs from 'node:fs';
import { parse, formatHex } from 'culori';
import { hex as contrastRatio } from 'wcag-contrast';

const css = fs.readFileSync('src/styles/core/tokens.css', 'utf8');
function extract(token) {
  const regex = new RegExp(`${token}:\\s*color-mix\\(\\s*in srgb,\\s*(oklch\\([^)]*\\))`, 'm');
  const match = css.match(regex);
  if (!match) {
    throw new Error(`Token ${token} not found`);
  }
  return formatHex(parse(match[1]));
}

const text = extract('--color-gray-900');
const bg = extract('--color-gray-50');
const ratio = contrastRatio(text, bg);

if (ratio < 4.5) {
  console.error(`Contrast ratio ${ratio.toFixed(2)} below 4.5:1`);
  process.exit(1);
}
console.log(`Contrast ratio ${ratio.toFixed(2)} passes WCAG AA`);
