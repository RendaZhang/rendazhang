import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChatPresetQuestions from '../components/chat/ChatPresetQuestions';
import { CHAT_PRESET_QUESTION_IDS, type ChatPresetQuestionId } from '../services/visitorEvents';

const questions = {
  who_is_renda: 'Who is Renda Zhang?',
  personalweb_proof: 'What does PersonalWeb prove?',
  cloud_native_evidence: 'What public evidence supports cloud-native engineering credibility?',
  certification_context: 'How does the AWS certification support the site credibility?',
  recruiter_summary: 'How should a recruiter evaluate this site quickly?'
} satisfies Readonly<Record<ChatPresetQuestionId, string>>;

function renderPresets(overrides: Partial<Parameters<typeof ChatPresetQuestions>[0]> = {}) {
  const onSelect = vi.fn();
  const trackPresetClick = vi.fn();

  render(
    <ChatPresetQuestions
      heading="Start with a public proof question"
      description="Choose a guided prompt."
      questions={questions}
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
      expect(screen.getByRole('button', { name: questions[presetId] })).toBeTruthy();
    }
  });

  it('tracks only the controlled preset ID and returns the question to the Chat input flow', () => {
    const { onSelect, trackPresetClick } = renderPresets();

    fireEvent.click(screen.getByRole('button', { name: questions.personalweb_proof }));

    expect(trackPresetClick).toHaveBeenCalledWith('chat_preset_question_clicked', {
      presetId: 'personalweb_proof'
    });
    expect(onSelect).toHaveBeenCalledWith('personalweb_proof', questions.personalweb_proof);
    expect(JSON.stringify(trackPresetClick.mock.calls)).not.toContain(questions.personalweb_proof);
  });

  it('does not call telemetry or selection handlers while disabled', () => {
    const { onSelect, trackPresetClick } = renderPresets({ disabled: true });

    const button = screen.getByRole('button', { name: questions.recruiter_summary });
    expect(button.hasAttribute('disabled')).toBe(true);
    fireEvent.click(button);

    expect(trackPresetClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
