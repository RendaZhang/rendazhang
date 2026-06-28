import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeToggle from '../components/ui/inputs/ThemeToggle';
import { initializeUiPreferences, resetUiPreferencesForTests } from '../stores/uiPreferencesStore';

const providerState = vi.hoisted(() => ({
  darkMode: false,
  themePalette: 'default' as 'default' | 'aurora' | 'forest',
  lang: 'en',
  setTheme: vi.fn(),
  setPalette: vi.fn()
}));

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: providerState.lang }),
  useTheme: () => ({
    darkMode: providerState.darkMode,
    themePalette: providerState.themePalette,
    setTheme: providerState.setTheme,
    setPalette: providerState.setPalette,
    toggle: vi.fn()
  })
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    resetUiPreferencesForTests();
    providerState.darkMode = false;
    providerState.themePalette = 'default';
    providerState.lang = 'en';
    providerState.setTheme.mockReset();
    providerState.setPalette.mockReset();
  });

  it('uses the UI preference store snapshot for the active theme option', () => {
    initializeUiPreferences({ themeMode: 'dark', preferencesReady: true });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }));

    const lightOption = screen.getByRole('button', { name: 'Switch to Light Mode' });
    const darkOption = screen.getByRole('button', { name: 'Switch to Dark Mode' });

    expect(lightOption.getAttribute('aria-pressed')).toBe('false');
    expect(darkOption.getAttribute('aria-pressed')).toBe('true');
    expect(darkOption.className).toContain('is-active');

    fireEvent.click(lightOption);
    expect(providerState.setTheme).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('button', { name: 'Switch to Light Mode' })).toBeNull();
  });

  it('uses the UI preference store snapshot for the active palette option', () => {
    initializeUiPreferences({ themePalette: 'forest', preferencesReady: true });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }));

    const defaultOption = screen.getByRole('button', { name: 'Switch to Default Palette' });
    const forestOption = screen.getByRole('button', { name: 'Switch to Forest Palette' });

    expect(defaultOption.getAttribute('aria-pressed')).toBe('false');
    expect(forestOption.getAttribute('aria-pressed')).toBe('true');
    expect(forestOption.className).toContain('is-active');

    fireEvent.click(defaultOption);
    expect(providerState.setPalette).toHaveBeenCalledWith('default');
    expect(screen.queryByRole('button', { name: 'Switch to Default Palette' })).toBeNull();
  });

  it('falls back to provider state until preferences are ready', () => {
    providerState.darkMode = true;
    providerState.themePalette = 'aurora';
    initializeUiPreferences({ themeMode: 'light', preferencesReady: false });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }));

    expect(
      screen.getByRole('button', { name: 'Switch to Dark Mode' }).getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: 'Switch to Aurora Palette' }).getAttribute('aria-pressed')
    ).toBe('true');
  });
});
