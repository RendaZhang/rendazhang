import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CertificationsContent from '../components/sections/CertificationsContent';
import { CERTIFICATIONS_PAGE_PATH, CHAT_PAGE_PATH, VERIFY_URLS } from '../constants';
import { CERTIFICATIONS_CONTENT, DOCS_CASE_STUDY_CONTENT } from '../content';

const visitorPlanningTerms =
  /proof surface|proof pillar|proof path|architecture credibility signal|certification context|evidence chain|source-bounded|runtime pin|browser smoke|证明面|证明支柱|证明路径|架构可信度信号|证书上下文|证据链/i;

describe('PersonalWeb case story', () => {
  it('keeps bilingual story structure and public destinations aligned', () => {
    expect(DOCS_CASE_STUDY_CONTENT.en.story).toHaveLength(3);
    expect(DOCS_CASE_STUDY_CONTENT.zh.story).toHaveLength(3);
    expect(DOCS_CASE_STUDY_CONTENT.en.story).toHaveLength(DOCS_CASE_STUDY_CONTENT.zh.story.length);
    expect(DOCS_CASE_STUDY_CONTENT.en.evidence).toHaveLength(
      DOCS_CASE_STUDY_CONTENT.zh.evidence.length
    );
    expect(DOCS_CASE_STUDY_CONTENT.en.nextActions.map(({ href }) => href)).toEqual([
      '#en-tech-stack',
      CERTIFICATIONS_PAGE_PATH,
      '/#contact'
    ]);
    expect(DOCS_CASE_STUDY_CONTENT.zh.nextActions.map(({ href }) => href)).toEqual([
      '#zh-技术栈',
      CERTIFICATIONS_PAGE_PATH,
      '/#contact'
    ]);
    expect(DOCS_CASE_STUDY_CONTENT.en.evidence.map(({ href }) => href)).toContain(CHAT_PAGE_PATH);
    expect(DOCS_CASE_STUDY_CONTENT.zh.evidence.map(({ href }) => href)).toContain(CHAT_PAGE_PATH);
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
    const certEn = CERTIFICATIONS_CONTENT.en.certificates[0];
    const certZh = CERTIFICATIONS_CONTENT.zh.certificates[0];

    expect(CERTIFICATIONS_CONTENT.en.coverageItems).toHaveLength(
      CERTIFICATIONS_CONTENT.zh.coverageItems.length
    );
    expect(certEn.title).toBe('AWS Certified Solutions Architect - Associate (SAA-C03)');
    expect(certEn.issued).toBe('2025-06-16');
    expect(certEn.expires).toBe('2028-06-16');
    expect(certZh.issued).toBe('2025 年 6 月 16 日');
    expect(certZh.expires).toBe('2028 年 6 月 16 日');
    expect(JSON.stringify(CERTIFICATIONS_CONTENT)).not.toMatch(visitorPlanningTerms);
  });

  it('places exact record details and the Credly badge before the coverage explanation', () => {
    const { container, unmount } = render(<CertificationsContent />);
    const overview = container.querySelector('.c-cert-overview');
    const coverage = container.querySelector('.c-cert-coverage');
    const links = Array.from(container.querySelectorAll('.c-verify-btn'));

    expect(overview?.children[0]?.classList.contains('c-cert-meta')).toBe(true);
    expect(overview?.children[1]?.classList.contains('c-cert-verification')).toBe(true);
    expect(overview?.querySelector('.c-credly-container iframe')).toBeTruthy();
    expect(coverage?.textContent).toContain('What this certification covers');
    expect(coverage?.textContent).toContain('这项认证覆盖什么');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      VERIFY_URLS.CREDLY,
      VERIFY_URLS.AWS
    ]);

    unmount();
  });
});
