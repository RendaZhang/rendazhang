import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LanguageSelector from '../components/ui/inputs/LanguageSelector';

const providerState = vi.hoisted(() => ({
  lang: 'en',
  updateLang: vi.fn()
}));

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: providerState.lang, updateLang: providerState.updateLang })
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    providerState.lang = 'en';
    providerState.updateLang.mockReset();
  });

  it('uses a labelled two-button selection group without partial listbox semantics', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button', { name: 'Change language' }));

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('group', { name: 'Language' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'English' }).getAttribute('aria-pressed')).toBe(
      'true'
    );
    expect(screen.getByRole('button', { name: '中文' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('closes on Escape and restores focus to the disclosure trigger', () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole('button', { name: 'Change language' });
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole('button', { name: 'English' }), { key: 'Escape' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('group', { name: 'Language' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('updates through the provider, closes, and restores focus after selection', () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole('button', { name: 'Change language' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: '中文' }));

    expect(providerState.updateLang).toHaveBeenCalledWith('zh-CN');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when focus leaves the disclosure', () => {
    render(<LanguageSelector />);
    const outside = document.createElement('button');
    document.body.append(outside);
    const trigger = screen.getByRole('button', { name: 'Change language' });
    fireEvent.click(trigger);

    const option = screen.getByRole('button', { name: 'English' });
    option.focus();
    fireEvent.blur(option, { relatedTarget: outside });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    outside.remove();
  });
});
