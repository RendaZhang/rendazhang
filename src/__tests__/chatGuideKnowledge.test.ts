import { describe, expect, it } from 'vitest';
import {
  buildChatGuidePresetPrompt,
  CHAT_GUIDE_PRESET_BOUNDARIES,
  CHAT_GUIDE_PRESET_IDS,
  CHAT_GUIDE_PUBLIC_SOURCE_CATEGORIES
} from '../content/chatGuideKnowledge';
import { CHAT_PRESET_QUESTION_IDS } from '../services/visitorEvents';

describe('chat guide knowledge boundary', () => {
  it('uses the same controlled preset IDs as the visitor event boundary', () => {
    expect([...CHAT_GUIDE_PRESET_IDS]).toEqual([...CHAT_PRESET_QUESTION_IDS]);
  });

  it('defines public source categories, allowed claims, and refusal guidance per preset', () => {
    for (const presetId of CHAT_GUIDE_PRESET_IDS) {
      const boundary = CHAT_GUIDE_PRESET_BOUNDARIES[presetId];

      expect(boundary.sourceCategories.length).toBeGreaterThan(0);
      expect(boundary.allowedClaims.length).toBeGreaterThan(0);
      expect(boundary.refusalGuidance.length).toBeGreaterThan(0);

      for (const sourceCategory of boundary.sourceCategories) {
        expect(CHAT_GUIDE_PUBLIC_SOURCE_CATEGORIES).toContain(sourceCategory);
      }
    }
  });

  it('builds a Chinese public-context prompt for the identity preset without guessing', () => {
    const prompt = buildChatGuidePresetPrompt('who_is_renda', 'Renda Zhang 是谁？', 'zh');

    expect(prompt).toContain('根据公开网站信息');
    expect(prompt).toContain('张人大');
    expect(prompt).toContain('PersonalWeb');
    expect(prompt).toContain('没有公开信息支持');
    expect(prompt).toContain('问题：Renda Zhang 是谁？');
    expect(prompt).not.toContain('虚构');
  });

  it('keeps generated preset context public and avoids private values or private endpoint paths', () => {
    for (const presetId of CHAT_GUIDE_PRESET_IDS) {
      const prompt = buildChatGuidePresetPrompt(presetId, 'Test public question?', 'en');

      expect(prompt).toContain('Answer using only the public PersonalWeb context below');
      expect(prompt).toContain('Allowed sources:');
      expect(prompt).toContain('Question:');
      expect(prompt).not.toMatch(/https?:\/\/|www\./i);
      expect(prompt).not.toMatch(/[?&][a-z0-9_-]+=/i);
      expect(prompt).not.toMatch(/[^\s@]+@[^\s@]+\.[^\s@]+/);
      expect(prompt).not.toMatch(/\+?\d[\d\s().-]{6,}\d/);
      expect(prompt).not.toMatch(/\/(?:api|cloudchat|internal|private|server)(?:\/|$)/i);
    }
  });

  it('falls back to controlled preset text when a caller passes arbitrary text', () => {
    const prompt = buildChatGuidePresetPrompt(
      'who_is_renda',
      'My email is visitor@example.com',
      'en'
    );

    expect(prompt).toContain('Question: Who is Renda Zhang?');
    expect(prompt).not.toContain('visitor@example.com');
  });
});
