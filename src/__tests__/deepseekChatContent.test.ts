import { describe, expect, it } from 'vitest';
import { DEEPSEEK_CHAT_CONTENT } from '../content/deepseekChatContent';
import { CHAT_PRESET_QUESTION_IDS } from '../services/visitorEvents';

describe('DeepSeek Chat visitor content', () => {
  it('keeps bilingual preset questions aligned to the controlled IDs', () => {
    expect(Object.keys(DEEPSEEK_CHAT_CONTENT.en.presets.questions)).toEqual([
      ...CHAT_PRESET_QUESTION_IDS
    ]);
    expect(Object.keys(DEEPSEEK_CHAT_CONTENT.zh.presets.questions)).toEqual([
      ...CHAT_PRESET_QUESTION_IDS
    ]);

    for (const presetId of CHAT_PRESET_QUESTION_IDS) {
      expect(DEEPSEEK_CHAT_CONTENT.en.presets.questions[presetId].length).toBeGreaterThan(0);
      expect(DEEPSEEK_CHAT_CONTENT.zh.presets.questions[presetId].length).toBeGreaterThan(0);
    }
  });

  it('uses direct visitor language without public-proof implementation terms', () => {
    const renderedContent = JSON.stringify(DEEPSEEK_CHAT_CONTENT);

    expect(renderedContent).not.toMatch(
      /public proof question|公开证明问题|public-source preset|proof surface|项目证明面|architecture credibility signal|架构可信度信号/i
    );
    expect(DEEPSEEK_CHAT_CONTENT.en.presets.description).toContain('send it now');
    expect(DEEPSEEK_CHAT_CONTENT.zh.presets.description).toContain('点击问题即可发送');
    expect(DEEPSEEK_CHAT_CONTENT.en.presets.description).toContain('public information');
    expect(DEEPSEEK_CHAT_CONTENT.zh.presets.description).toContain('公开信息');
  });
});
