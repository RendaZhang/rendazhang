import { describe, expect, it } from 'vitest';
import { ABOUT_CONTENT, HOME_SKILL_INDEX } from '../content';

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
  it('keeps the author signature and remaining profile structure bilingual', () => {
    expect(ABOUT_CONTENT.en.signature).toEqual({
      name: 'Renda Zhang',
      line: 'Backend engineer in Shenzhen.'
    });
    expect(ABOUT_CONTENT.zh.signature).toEqual({
      name: '张人大',
      line: '在深圳写后端。'
    });
    for (const section of ['experience', 'education'] as const) {
      const zhEntries = ABOUT_CONTENT.zh[section].entries;
      const enEntries = ABOUT_CONTENT.en[section].entries;
      expect(zhEntries.map(({ id }) => id)).toEqual(enEntries.map(({ id }) => id));
      expect([...zhEntries, ...enEntries].every(({ result }) => result)).toBe(true);
    }
    expect(HOME_SKILL_INDEX.map(({ id }) => id)).toEqual(['backend', 'ai', 'cloud', 'reliability']);
    expect(HOME_SKILL_INDEX.every(({ label }) => label.en && label.zh)).toBe(true);
  });

  it('keeps internal planning language and unscored skill metrics out of visitor copy', () => {
    const visitorCopy = JSON.stringify(ABOUT_CONTENT);
    const internalTerms =
      /proof path|proof surface|certification context|contact intent|main proof|credential proof|guided proof|证明路径|证书上下文|联系意向|主证明|证书证明|导览证明|\bsurface\b|\bcredential\b|\bpreset\b/i;

    expect(visitorCopy).not.toMatch(internalTerms);
    expect(HOME_SKILL_INDEX.every((category) => !('level' in category))).toBe(true);
  });
});
