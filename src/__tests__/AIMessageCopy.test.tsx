import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AIMessage from '../components/chat/AIMessage';
import { DEEPSEEK_CHAT_CONTENT } from '../content/deepseekChatContent';
import { UI_DURATIONS } from '../constants/settings';

const reply = '# Example reply\n\nSome **formatted** text.';
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function stubClipboard(clipboard?: Pick<Clipboard, 'writeText'>) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
}

function renderReply(language: 'en' | 'zh' = 'en') {
  const texts = DEEPSEEK_CHAT_CONTENT[language];
  render(
    <AIMessage
      text={reply}
      enhance={false}
      texts={texts}
      sourceHintsHeading={texts.sourceHints.heading}
      sourceHintsAriaLabel={texts.sourceHints.ariaLabel}
    />
  );
  return {
    copy: screen.getByRole('button', { name: texts.copyLabel }),
    status: screen.getByRole('status')
  };
}

afterEach(() => {
  if (clipboardDescriptor) {
    Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  } else {
    Reflect.deleteProperty(navigator, 'clipboard');
  }
  vi.useRealTimers();
});

describe('Chat reply copy', () => {
  it('uses the raw Markdown and shows the check only after the pending write succeeds', async () => {
    vi.useFakeTimers();
    let completeWrite!: () => void;
    const pendingWrite = new Promise<void>((resolve) => {
      completeWrite = resolve;
    });
    const writeText = vi.fn(() => pendingWrite);
    stubClipboard({ writeText });
    const { copy, status } = renderReply();
    fireEvent.click(copy);

    expect(writeText).toHaveBeenCalledExactlyOnceWith(reply);
    expect(copy.hasAttribute('data-copied')).toBe(false);
    expect(status.textContent).toBe('');

    await act(async () => completeWrite());
    expect(copy.hasAttribute('data-copied')).toBe(true);
    expect(status.textContent).toBe('Copied');

    await act(async () => {
      vi.advanceTimersByTime(UI_DURATIONS.COPY_FEEDBACK);
    });
    expect(copy.hasAttribute('data-copied')).toBe(false);
    expect(status.textContent).toBe('');
  });

  it('keeps failure visible during an available retry and switches to success on resolution', async () => {
    let completeRetry!: () => void;
    const pendingRetry = new Promise<void>((resolve) => {
      completeRetry = resolve;
    });
    const writeText = vi
      .fn<Clipboard['writeText']>()
      .mockRejectedValueOnce(new DOMException('Denied', 'NotAllowedError'))
      .mockReturnValueOnce(pendingRetry);
    stubClipboard({ writeText });
    const { copy, status } = renderReply('zh');
    copy.focus();

    await act(async () => {
      fireEvent.click(copy);
    });
    expect(copy.hasAttribute('data-copy-failed')).toBe(true);
    expect(copy.hasAttribute('data-copied')).toBe(false);
    expect(copy.hasAttribute('disabled')).toBe(false);
    expect(status.textContent).toBe('复制失败，请重试。');
    expect(document.activeElement).toBe(copy);

    fireEvent.click(copy);
    expect(status.textContent).toBe('复制失败，请重试。');
    await act(async () => completeRetry());
    expect(copy.hasAttribute('data-copy-failed')).toBe(false);
    expect(copy.hasAttribute('data-copied')).toBe(true);
    expect(status.textContent).toBe('已复制');
  });

  it('ignores a stale result when a later activation has succeeded', async () => {
    let rejectOlderWrite!: (error: Error) => void;
    const olderWrite = new Promise<void>((_resolve, reject) => {
      rejectOlderWrite = reject;
    });
    const writeText = vi
      .fn<Clipboard['writeText']>()
      .mockReturnValueOnce(olderWrite)
      .mockResolvedValueOnce(undefined);
    stubClipboard({ writeText });
    const { copy, status } = renderReply();
    fireEvent.click(copy);
    await act(async () => {
      fireEvent.click(copy);
    });
    expect(status.textContent).toBe('Copied');

    await act(async () => rejectOlderWrite(new Error('Denied')));
    expect(copy.hasAttribute('data-copied')).toBe(true);
    expect(copy.hasAttribute('data-copy-failed')).toBe(false);
    expect(status.textContent).toBe('Copied');
  });

  it('reports unavailable clipboard access and refreshes a repeated status announcement', async () => {
    stubClipboard();
    const { copy, status } = renderReply();
    await act(async () => {
      fireEvent.click(copy);
    });
    expect(status.textContent).toBe('Couldn’t copy. Try again.');

    await act(async () => {
      fireEvent.click(copy);
    });
    expect(status.textContent).toBe('Couldn’t copy. Try again.\u00a0');
  });
});
