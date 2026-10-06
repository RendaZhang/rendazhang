// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const require = createRequire(import.meta.url);

describe('Sharp native image security patch regression', () => {
  it('loads the reviewed native bundle on the current test platform', () => {
    process.stdout.write(
      `Sharp native evidence: ${JSON.stringify({
        platform: process.platform,
        arch: process.arch,
        node: process.version,
        versions: sharp.versions
      })}\n`
    );
    expect(sharp.versions.sharp).toBe('0.35.5');
    expect(sharp.versions.heif).toBe('1.23.5');
    expect(sharp.versions.vips).toBe('8.18.7');
    expect(sharp.versions.rsvg).toBe('2.63.2');
  });

  it('shares the patched native instance with the Astro consumer', () => {
    const astroRequire = createRequire(require.resolve('astro/package.json'));
    expect(astroRequire.resolve('sharp')).toBe(require.resolve('sharp'));
    // Compare Node consumers directly; Vitest wraps the ESM import.
    const astroSharp = astroRequire('sharp') as typeof sharp;
    expect(astroSharp).toBe(require('sharp'));
    expect(astroSharp.versions).toEqual(sharp.versions);
  });

  it.each(['jpeg', 'webp', 'avif'] as const)(
    'decodes and resizes a tiny benign %s image using the native library',
    async (format) => {
      const fixture = await sharp({
        create: {
          width: 8,
          height: 6,
          channels: 3,
          background: { r: 48, g: 96, b: 144 }
        }
      })
        .toFormat(format)
        .toBuffer();

      const metadata = await sharp(fixture).metadata();
      expect(metadata).toMatchObject({
        width: 8,
        height: 6,
        format: format === 'avif' ? 'heif' : format
      });
      if (format === 'avif') expect(metadata.compression).toBe('av1');

      const { data, info } = await sharp(fixture)
        .resize(4, 3)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      expect(info).toMatchObject({ width: 4, height: 3, channels: 3, format: 'raw' });
      expect(data.length).toBe(4 * 3 * 3);
      for (let pixel = 0; pixel < data.length; pixel += 3) {
        for (const [channel, expected] of [48, 96, 144].entries()) {
          expect(Math.abs(data[pixel + channel] - expected)).toBeLessThanOrEqual(8);
        }
      }
    }
  );

  it('rejects bounded non-image input before metadata or resize output', async () => {
    const invalid = Buffer.from('This is plain text, not an image.');
    await expect(sharp(invalid).metadata()).rejects.toThrow(/unsupported image format/i);
    await expect(sharp(invalid).resize(4, 3).toBuffer()).rejects.toThrow(
      /unsupported image format/i
    );
  });

  it('rasterizes and resizes a self-contained SVG with the expected pixels', async () => {
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12">' +
        '<rect width="16" height="12" fill="#306090"/></svg>'
    );
    const options = { limitInputPixels: 256, density: 72 };
    expect(await sharp(svg, options).metadata()).toMatchObject({
      format: 'svg',
      width: 16,
      height: 12
    });
    const png = await sharp(svg, options).resize(8, 6).png().toBuffer();
    expect(png.length).toBeLessThan(2048);
    expect(await sharp(png).metadata()).toMatchObject({
      format: 'png',
      width: 8,
      height: 6
    });
    const { data, info } = await sharp(png)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(info).toMatchObject({ width: 8, height: 6, channels: 3, format: 'raw' });
    expect(data.length).toBe(8 * 6 * 3);
    for (const pixel of [0, 27, 47]) {
      expect([...data.subarray(pixel * 3, pixel * 3 + 3)]).toEqual([48, 96, 144]);
    }
  });

  it('rejects a tiny malformed SVG in a hard-timeout native child', () => {
    // A native parser regression must not keep the test worker alive indefinitely.
    const child = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '--unhandled-rejections=strict',
        '-e',
        `import assert from 'node:assert/strict';
         import sharp from ${JSON.stringify(pathToFileURL(require.resolve('sharp')).href)};
         const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><rect></svg>');
         const options = { limitInputPixels: 256, density: 72 };
         await assert.rejects(sharp(svg, options).metadata(), /svg|xml|corrupt/i);
         await assert.rejects(sharp(svg, options).resize(4, 3).png().toBuffer(), /svg|xml|corrupt/i);
         process.stdout.write('malformed-svg-rejected');`
      ],
      { encoding: 'utf8', timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 65536 }
    );
    expect(child.error).toBeUndefined();
    expect(child.signal).toBeNull();
    expect(child.status, child.stderr).toBe(0);
    expect(child.stdout).toBe('malformed-svg-rejected');
  });
});
