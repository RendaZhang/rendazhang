import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChatPresetQuestions from '../components/chat/ChatPresetQuestions';
import { CHAT_PRESET_QUESTION_IDS, type ChatPresetQuestionId } from '../services/visitorEvents';

const topics = {
  who_is_renda: 'Renda Zhang',
  personalweb_proof: 'PersonalWeb',
  cloud_native_evidence: 'Cloud-native work',
  certification_context: 'AWS certification',
  recruiter_summary: 'For recruiters'
} satisfies Readonly<Record<ChatPresetQuestionId, string>>;

function renderPresets(overrides: Partial<Parameters<typeof ChatPresetQuestions>[0]> = {}) {
  const onSelect = vi.fn();
  const trackPresetClick = vi.fn();

  render(
    <ChatPresetQuestions
      heading="Ask about Renda and PersonalWeb"
      description="Pick a topic to preview its question."
      topics={topics}
      selectedPresetId="personalweb_proof"
      onSelect={onSelect}
      trackPresetClick={trackPresetClick}
      {...overrides}
    />
  );

  return { onSelect, trackPresetClick };
}

describe('ChatPresetQuestions', () => {
  it('renders one guided button for each controlled preset ID', () => {
    renderPresets();

    for (const presetId of CHAT_PRESET_QUESTION_IDS) {
      expect(screen.getByRole('button', { name: topics[presetId] })).toBeTruthy();
    }
  });

  it('marks the selected topic and forwards only a controlled preset ID', () => {
    const { onSelect, trackPresetClick } = renderPresets();

    const button = screen.getByRole('button', { name: topics.personalweb_proof, pressed: true });
    fireEvent.click(button);

    expect(trackPresetClick).toHaveBeenCalledWith('chat_preset_question_clicked', {
      presetId: 'personalweb_proof'
    });
    expect(onSelect).toHaveBeenCalledWith('personalweb_proof');
  });

  it('does not call telemetry or selection handlers while disabled', () => {
    const { onSelect, trackPresetClick } = renderPresets({ disabled: true });

    const button = screen.getByRole('button', { name: topics.recruiter_summary });
    expect(button.hasAttribute('disabled')).toBe(true);
    fireEvent.click(button);

    expect(trackPresetClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
