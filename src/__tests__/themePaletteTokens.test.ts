import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const tokensCss = readFileSync('src/styles/core/tokens.css', 'utf8');
const themeTokensCss = readFileSync('src/styles/core/theme-tokens.css', 'utf8');

const paletteContrastTokens = [
  '--palette-aurora-brand',
  '--palette-aurora-secondary',
  '--palette-forest-brand',
  '--palette-forest-secondary'
] as const;

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseOklch(value: string): { l: number; c: number; h: number } {
  const match = value.match(/oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/);

  if (!match) {
    throw new Error(`Could not parse ${value}`);
  }

  return {
    l: Number(match[1]) / 100,
    c: Number(match[2]),
    h: Number(match[3])
  };
}

function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value;
  }

  return 1.055 * value ** (1 / 2.4) - 0.055;
}

function oklchToRgb(value: string): RgbColor {
  const { l, c, h } = parseOklch(value);
  const radians = (h * Math.PI) / 180;
  const a = Math.cos(radians) * c;
  const b = Math.sin(radians) * c;
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;
  const lmsL = lPrime ** 3;
  const lmsM = mPrime ** 3;
  const lmsS = sPrime ** 3;

  return {
    r: Math.min(
      1,
      Math.max(0, linearToSrgb(4.0767416621 * lmsL - 3.3077115913 * lmsM + 0.2309699292 * lmsS))
    ),
    g: Math.min(
      1,
      Math.max(0, linearToSrgb(-1.2684380046 * lmsL + 2.6097574011 * lmsM - 0.3413193965 * lmsS))
    ),
    b: Math.min(
      1,
      Math.max(0, linearToSrgb(-0.0041960863 * lmsL - 0.7034186147 * lmsM + 1.707614701 * lmsS))
    )
  };
}

function relativeLuminance({ r, g, b }: RgbColor): number {
  const toLinear = (value: number): number =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastWithWhite(color: RgbColor): number {
  const whiteLuminance = 1;
  const colorLuminance = relativeLuminance(color);
  return (whiteLuminance + 0.05) / (colorLuminance + 0.05);
}

function extractOklchToken(token: string): string {
  const regex = new RegExp(`${token}:\\s*color-mix\\(\\s*in srgb,\\s*(oklch\\([^)]*\\))`, 'm');
  const match = tokensCss.match(regex);

  if (!match?.[1]) {
    throw new Error(`Token ${token} not found`);
  }

  return match[1];
}

describe('theme palette tokens', () => {
  it('keeps legacy palette colors readable with their white on-primary', () => {
    for (const token of paletteContrastTokens) {
      const color = oklchToRgb(extractOklchToken(token));
      expect(contrastWithWhite(color), token).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('checks actual Ink CSS roles, composites and both legacy modes', () => {
    const result = JSON.parse(
      execFileSync(process.execPath, ['scripts/contrast-check.mjs'], {
        encoding: 'utf8',
        timeout: 5000
      })
    ) as { checks: number; minimumText: number };
    expect(result.checks).toBe(146);
    expect(result.minimumText).toBeGreaterThanOrEqual(4.5);
    expect(themeTokensCss).toContain('--color-on-primary: var(--palette-ink-dark-on-primary)');
    expect(themeTokensCss).toContain(
      "html:not([data-palette='aurora']):not([data-palette='forest'])"
    );
    expect(themeTokensCss).not.toMatch(/--color-gray-900:\s*var\(--palette-ink/);
  });

  it('maps non-default palette DOM attributes to semantic theme tokens', () => {
    expect(themeTokensCss).toContain("html[data-palette='aurora']");
    expect(themeTokensCss).toContain("html[data-palette='forest']");
    expect(themeTokensCss).toContain('--color-brand: var(--palette-aurora-brand)');
    expect(themeTokensCss).toContain('--color-brand: var(--palette-forest-brand)');
  });
});
