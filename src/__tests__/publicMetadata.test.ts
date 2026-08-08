import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  CERTIFICATIONS_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  DOCS_DESCRIPTION,
  IMAGE_PATHS,
  SITE_DESCRIPTION_EN
} from '../constants';

const maintainerPhrases =
  /proof surface|proof chain|project proof|architecture credibility context/i;
const qualityArchitectureDoc = 'docs/CHAT_GUIDE_QUALITY_ARCHITECTURE.md';

describe('public metadata alignment', () => {
  it('uses unique natural descriptions without maintainer-facing phrases', () => {
    const descriptions = [SITE_DESCRIPTION_EN, DOCS_DESCRIPTION, CERTIFICATIONS_DESCRIPTION];

    expect(new Set(descriptions)).toHaveLength(descriptions.length);
    descriptions.forEach((description) => {
      expect(description).toContain('Renda Zhang');
      expect(description).not.toMatch(maintainerPhrases);
    });
    expect(DEFAULT_SOCIAL_IMAGE_ALT).not.toMatch(maintainerPhrases);
  });

  it('keeps the general and certification social images under separate ownership', () => {
    const baseLayout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
    const certificationsPage = readFileSync('src/pages/certifications.astro', 'utf8');

    expect(DEFAULT_SOCIAL_IMAGE).toBe(IMAGE_PATHS.DEFAULT_COVER);
    expect(DEFAULT_SOCIAL_IMAGE).not.toBe(IMAGE_PATHS.CERTIFICATIONS_COVER);
    expect(baseLayout).toContain('DEFAULT_SOCIAL_IMAGE');
    expect(baseLayout).toContain('DEFAULT_SOCIAL_IMAGE_ALT');
    expect(certificationsPage.match(/IMAGE_PATHS\.CERTIFICATIONS_COVER/g)).toHaveLength(3);
  });
});

describe('public discovery files', () => {
  it('publishes exactly the three canonical sitemap routes with significant update dates', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    const xml = new DOMParser().parseFromString(sitemap, 'application/xml');
    const urls = Array.from(xml.getElementsByTagName('url'));

    expect(xml.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(urls.map((url) => url.getElementsByTagName('loc')[0]?.textContent)).toEqual([
      'https://www.rendazhang.com/',
      'https://www.rendazhang.com/docs/',
      'https://www.rendazhang.com/certifications/'
    ]);
    expect(urls.map((url) => url.getElementsByTagName('lastmod')[0]?.textContent)).toEqual([
      '2026-08-08',
      '2026-08-08',
      '2026-08-08'
    ]);
    expect(sitemap).not.toContain('/deepseek_chat/');
    expect(sitemap).not.toMatch(/<(?:changefreq|priority)>/);
  });

  it('keeps llms.txt factual, canonical, public-safe, and visitor-readable', () => {
    const llms = readFileSync('public/llms.txt', 'utf8');

    expect(llms).toContain('Renda Zhang / 张人大');
    expect(llms).toContain('OneConnect');
    expect(llms).toContain('PersonalWeb');
    expect(llms).toContain('AWS Certified Solutions Architect - Associate');
    expect(llms).toContain('University of Minnesota');
    expect(llms).toContain('https://www.rendazhang.com/');
    expect(llms).toContain('https://www.rendazhang.com/docs/');
    expect(llms).toContain('https://www.rendazhang.com/certifications/');
    expect(llms).toContain('https://www.rendazhang.com/deepseek_chat/');
    expect(llms).toContain('## Privacy');
    expect(llms).not.toMatch(maintainerPhrases);
    expect(llms).not.toMatch(/Entity Notes For Search And AI Systems/i);
    expect(llms).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
    expect(llms).not.toMatch(/(?:\+?86[- ]?)?1[3-9]\d{9}/);
    expect(llms).not.toMatch(/\/(?:opt|etc|var|home|users)\//i);
  });
});

describe('README source and generated-asset parity', () => {
  it('links the Chat Guide quality architecture from both source READMEs', () => {
    const readmeZh = readFileSync('README.md', 'utf8');
    const readmeEn = readFileSync('README_EN.md', 'utf8');

    expect(readmeZh.match(new RegExp(qualityArchitectureDoc, 'g'))).toHaveLength(1);
    expect(readmeEn.match(new RegExp(qualityArchitectureDoc, 'g'))).toHaveLength(1);
  });

  it('keeps the bundled documentation assets synchronized with their sources', () => {
    expect(readFileSync('src/assets/README.md', 'utf8')).toBe(readFileSync('README.md', 'utf8'));
    expect(readFileSync('src/assets/README_EN.md', 'utf8')).toBe(
      readFileSync('README_EN.md', 'utf8')
    );
  });
});
