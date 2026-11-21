import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CertificationsContent from '../components/sections/CertificationsContent';
import { VERIFY_URLS } from '../constants';
import { DOCS_CASE_STUDY_CONTENT } from '../content';
import { renderDocsMarkdown } from '../utils/renderDocsMarkdown';
import { CERTIFICATION_TOPICS, CERTIFICATIONS_CONTENT } from '../content/certificationsContent';

const visitorPlanningTerms =
  /proof surface|proof pillar|proof path|architecture credibility signal|certification context|evidence chain|source-bounded|runtime pin|browser smoke|证明面|证明支柱|证明路径|架构可信度信号|证书上下文|证据链/i;

describe('PersonalWeb case story', () => {
  it('keeps both routes and their chapter links aligned with the translated README', () => {
    for (const [locale, readmePath] of [
      ['en', 'README_EN.md'],
      ['zh', 'README.md']
    ] as const) {
      const readme = renderDocsMarkdown(readFileSync(readmePath, 'utf8'), locale);
      const { routes, nodes } = DOCS_CASE_STUDY_CONTENT[locale];

      expect(Object.keys(routes)).toEqual(['page', 'chat']);
      expect(Object.keys(nodes.browser.notes)).toEqual(['page', 'chat']);
      expect(Object.keys(nodes.nginx.notes)).toEqual(['page', 'chat']);
      expect(Object.keys(nodes.static.notes)).toEqual(['page']);
      expect(Object.keys(nodes.flask.notes)).toEqual(['chat']);
      expect(Object.keys(nodes.model.notes)).toEqual(['chat']);
      for (const { section } of Object.values(nodes)) {
        expect(readme).toContain(`id="${section.href.slice(1)}"`);
      }
    }
  });

  it('keeps visitor-facing planning language out of the case story', () => {
    expect(JSON.stringify(DOCS_CASE_STUDY_CONTENT)).not.toMatch(visitorPlanningTerms);
  });

  it('preserves legacy README anchors while using natural overview headings', () => {
    const readmeZh = readFileSync('README.md', 'utf8');
    const readmeEn = readFileSync('README_EN.md', 'utf8');
    const overviewZh = readmeZh.split('## PersonalWeb 项目概览')[1]?.split('## 技术栈')[0];
    const overviewEn = readmeEn
      .split('## PersonalWeb Project Overview')[1]
      ?.split('## Tech Stack')[0];

    expect(readmeZh).toContain('id="zh-personalweb-项目证明"');
    expect(readmeEn).toContain('id="en-personalweb-proof-surface"');
    expect(overviewZh).toBeTruthy();
    expect(overviewEn).toBeTruthy();
    expect(overviewZh).not.toMatch(visitorPlanningTerms);
    expect(overviewEn).not.toMatch(visitorPlanningTerms);
  });
});

describe('certification evidence', () => {
  it('keeps bilingual coverage, exact dates, and verification facts aligned', () => {
    const certEn = CERTIFICATIONS_CONTENT.en.certificate;
    const certZh = CERTIFICATIONS_CONTENT.zh.certificate;

    expect(CERTIFICATION_TOPICS).toHaveLength(3);
    for (const { description, source } of CERTIFICATION_TOPICS) {
      expect(description.en).toBeTruthy();
      expect(description.zh).toBeTruthy();
      expect(source).toMatch(/^https:\/\/docs\.aws\.amazon\.com\/aws-certification\//);
    }
    expect(certEn.title).toBe('AWS Certified Solutions Architect - Associate (SAA-C03)');
    expect(certEn.issued).toBe('2025-06-16');
    expect(certEn.expires).toBe('2028-06-16');
    expect(certZh.issued).toBe('2025 年 6 月 16 日');
    expect(certZh.expires).toBe('2028 年 6 月 16 日');
    expect(JSON.stringify(CERTIFICATIONS_CONTENT)).not.toMatch(visitorPlanningTerms);
  });

  it('places exact record details and the Credly badge before the coverage explanation', () => {
    const { container } = render(
      <CertificationsContent>
        <span>Credly badge</span>
      </CertificationsContent>
    );
    const overview = container.querySelector('.c-cert-overview');
    const coverage = container.querySelector('.c-cert-coverage');
    const links = Array.from(container.querySelectorAll('.c-verify-btn'));

    expect(overview?.children[0]?.classList.contains('c-cert-verification')).toBe(true);
    expect(overview?.children[0]?.textContent).toBe('Credly badge');
    expect(overview?.children[1]?.querySelector('.c-cert-meta')).toBeTruthy();
    expect(overview?.children[1]?.querySelectorAll('.c-verify-btn')).toHaveLength(2);
    expect(coverage?.hasAttribute('open')).toBe(false);
    expect(coverage?.querySelector('a[href="/docs/#en-reference-architecture"]')?.textContent).toBe(
      'Reference Architecture'
    );
    expect(coverage?.querySelector('a[href="/docs/#zh-参考架构"]')?.textContent).toBe('参考架构');
    expect(
      coverage?.querySelector('a[href="/deepseek_chat/?preset=certification_context"]')
    ).toBeTruthy();
    expect(coverage?.textContent).toContain('What this certification covers');
    expect(coverage?.textContent).toContain('这项认证覆盖什么');
    expect(coverage?.textContent).not.toMatch(/Explore related work|接着探索/);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      VERIFY_URLS.CREDLY,
      VERIFY_URLS.AWS
    ]);
  });
});
