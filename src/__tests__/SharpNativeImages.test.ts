// @vitest-environment node
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

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
    expect(sharp.versions.sharp).toBe('0.35.4');
    expect(sharp.versions.heif).toBe('1.23.2');
    expect(sharp.versions.vips).toBe('8.18.6');
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
});
