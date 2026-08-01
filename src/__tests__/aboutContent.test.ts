import { describe, expect, it } from 'vitest';
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
