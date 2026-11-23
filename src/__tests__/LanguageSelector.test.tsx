import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LanguageSelector from '../components/ui/inputs/LanguageSelector';

const providerState = vi.hoisted(() => ({
  lang: 'en',
  updateLang: vi.fn()
}));

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: providerState.lang, updateLang: providerState.updateLang })
}));

describe('LanguageSelector', () => {
  it.each([
    { current: 'zh-CN', target: 'en', label: 'EN', name: 'Switch to English' },
    { current: 'en', target: 'zh-CN', label: '中文', name: '切换到中文' }
  ])('switches from $current to $target with one button', ({ current, target, label, name }) => {
    providerState.lang = current;
    providerState.updateLang.mockReset();
    render(<LanguageSelector />);

    const button = screen.getByRole('button', { name });
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(button.textContent).toBe(label);
    expect(button.getAttribute('lang')).toBe(target);
    expect(button.hasAttribute('aria-expanded')).toBe(false);

    fireEvent.click(button);
    expect(providerState.updateLang).toHaveBeenCalledExactlyOnceWith(target);
  });
});
