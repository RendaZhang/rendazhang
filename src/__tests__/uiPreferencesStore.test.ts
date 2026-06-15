import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_UI_PREFERENCES,
  getUiPreferencesSnapshot,
  initializeUiPreferences,
  isThemeMode,
  persistThemeMode,
  readStoredThemeMode,
  resetUiPreferencesForTests,
  setChatWidgetOpen,
  setPreferencesReady,
  setThemeMode,
  subscribeUiPreferences,
  type ThemeMode,
  type UiPreferenceStorageAdapter
} from '../stores/uiPreferencesStore';

function createStorageAdapter(initial: Record<string, string> = {}): UiPreferenceStorageAdapter & {
  values: Map<string, string>;
} {
  const values = new Map(Object.entries(initial));

  return {
    values,
    get<T = unknown>(key: string): T | string | null {
      return (values.get(key) as T | string | undefined) ?? null;
    },
    set<T = unknown>(key: string, value: T): void {
      values.set(key, String(value));
    }
  };
}

describe('uiPreferencesStore', () => {
  beforeEach(() => {
    resetUiPreferencesForTests();
  });

  it('starts with public UI preference defaults', () => {
    expect(getUiPreferencesSnapshot()).toBe(DEFAULT_UI_PREFERENCES);
    expect(getUiPreferencesSnapshot()).toEqual({
      themeMode: 'light',
      chatWidgetOpen: false,
      preferencesReady: false
    });
  });

  it('updates theme, chat widget, and readiness state', () => {
    setThemeMode('dark');
    setChatWidgetOpen(true);
    setPreferencesReady(true);

    expect(getUiPreferencesSnapshot()).toEqual({
      themeMode: 'dark',
      chatWidgetOpen: true,
      preferencesReady: true
    });
  });

  it('notifies subscribers only when state changes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeUiPreferences(listener);

    setThemeMode('light');
    expect(listener).not.toHaveBeenCalled();

    setThemeMode('dark');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setThemeMode('light');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('initializes only recognized preference fields', () => {
    initializeUiPreferences({
      themeMode: 'dark',
      chatWidgetOpen: true,
      preferencesReady: true
    });

    expect(getUiPreferencesSnapshot()).toEqual({
      themeMode: 'dark',
      chatWidgetOpen: true,
      preferencesReady: true
    });
  });

  it('reads and persists valid theme modes through an injected storage adapter', () => {
    const adapter = createStorageAdapter({ preferred_theme: 'dark' });

    expect(readStoredThemeMode(adapter, 'preferred_theme')).toBe('dark');
    expect(persistThemeMode('light', adapter, 'preferred_theme')).toBe('light');
    expect(adapter.values.get('preferred_theme')).toBe('light');
  });

  it('falls back when stored theme data is not a supported mode', () => {
    const adapter = createStorageAdapter({ preferred_theme: 'system' });

    expect(readStoredThemeMode(adapter, 'preferred_theme', 'dark')).toBe('dark');
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
  });

  it('keeps theme mode values narrowed to the supported union', () => {
    const mode: ThemeMode = readStoredThemeMode(
      createStorageAdapter({ preferred_theme: 'light' }),
      'preferred_theme'
    );

    expect(mode).toBe('light');
  });
});
