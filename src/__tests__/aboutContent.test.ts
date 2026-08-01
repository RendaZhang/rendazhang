import { describe, expect, it } from 'vitest';
import { CHAT_PAGE_PATH, CERTIFICATIONS_PAGE_PATH, DOCS_PAGE_PATH } from '../constants';
import { ABOUT_CONTENT } from '../content';

describe('time-sensitive public profile content', () => {
  it('describes the July 2026 career move in completed or current tense', () => {
    const englishContent = JSON.stringify(ABOUT_CONTENT.en);
    const chineseContent = JSON.stringify(ABOUT_CONTENT.zh);

    expect(englishContent).toContain('On July 6, 2026, I joined OneConnect');
    expect(englishContent).toContain('Jul 2026 - Present');
    expect(englishContent).not.toMatch(/will join|joining OneConnect|Incoming role|Starts Jul/i);

    expect(chineseContent).toContain('我于 2026 年 7 月 6 日加入金融壹账通');
    expect(chineseContent).toContain('2026年7月 - 至今');
    expect(chineseContent).not.toMatch(/我将加入|将于 2026|即将加入/);
  });
});

describe('homepage personal narrative', () => {
  it('keeps bilingual structure and public destinations aligned', () => {
    expect(ABOUT_CONTENT.en.heroHeading).toBe('Renda Zhang');
    expect(ABOUT_CONTENT.zh.heroHeading).toBe('张人大');
    expect(ABOUT_CONTENT.en.paragraphs).toHaveLength(ABOUT_CONTENT.zh.paragraphs.length);
    expect(ABOUT_CONTENT.en.proofPath.actions).toHaveLength(
      ABOUT_CONTENT.zh.proofPath.actions.length
    );
    expect(ABOUT_CONTENT.en.skills.categories).toHaveLength(
      ABOUT_CONTENT.zh.skills.categories.length
    );

    const expectedDestinations = [
      DOCS_PAGE_PATH,
      CERTIFICATIONS_PAGE_PATH,
      CHAT_PAGE_PATH,
      '#contact'
    ];

    expect(ABOUT_CONTENT.en.proofPath.actions.map(({ href }) => href)).toEqual(
      expectedDestinations
    );
    expect(ABOUT_CONTENT.zh.proofPath.actions.map(({ href }) => href)).toEqual(
      expectedDestinations
    );
  });

  it('keeps internal planning language and unscored skill metrics out of visitor copy', () => {
    const visitorCopy = JSON.stringify(ABOUT_CONTENT);
    const internalTerms =
      /proof path|proof surface|certification context|contact intent|main proof|credential proof|guided proof|证明路径|证书上下文|联系意向|主证明|证书证明|导览证明|\bsurface\b|\bcredential\b|\bpreset\b/i;

    expect(visitorCopy).not.toMatch(internalTerms);
    expect(ABOUT_CONTENT.en.skills.categories.every((category) => !('level' in category))).toBe(
      true
    );
    expect(ABOUT_CONTENT.zh.skills.categories.every((category) => !('level' in category))).toBe(
      true
    );
  });
});
