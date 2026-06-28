import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_UI_PREFERENCES,
  getUiPreferencesSnapshot,
  initializeUiPreferences,
  isThemeMode,
  isThemePalette,
  persistThemeMode,
  persistThemePalette,
  readStoredThemeMode,
  readStoredThemePalette,
  resetUiPreferencesForTests,
  setChatWidgetOpen,
  setPreferencesReady,
  setThemeMode,
  setThemePalette,
  subscribeUiPreferences,
  THEME_PALETTES,
  type ThemeMode,
  type ThemePalette,
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
      themePalette: 'default',
      chatWidgetOpen: false,
      preferencesReady: false
    });
  });

  it('updates theme, palette, chat widget, and readiness state', () => {
    setThemeMode('dark');
    setThemePalette('aurora');
    setChatWidgetOpen(true);
    setPreferencesReady(true);

    expect(getUiPreferencesSnapshot()).toEqual({
      themeMode: 'dark',
      themePalette: 'aurora',
      chatWidgetOpen: true,
      preferencesReady: true
    });
  });

  it('notifies subscribers only when state changes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeUiPreferences(listener);

    setThemeMode('light');
    expect(listener).not.toHaveBeenCalled();

    setThemePalette('default');
    expect(listener).not.toHaveBeenCalled();

    setThemePalette('forest');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    setThemeMode('dark');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('initializes only recognized preference fields', () => {
    initializeUiPreferences({
      themeMode: 'dark',
      themePalette: 'forest',
      chatWidgetOpen: true,
      preferencesReady: true
    });

    expect(getUiPreferencesSnapshot()).toEqual({
      themeMode: 'dark',
      themePalette: 'forest',
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

  it('reads and persists valid palette preferences through an injected storage adapter', () => {
    const adapter = createStorageAdapter({ preferred_palette: 'aurora' });

    expect(readStoredThemePalette(adapter, 'preferred_palette')).toBe('aurora');
    expect(persistThemePalette('forest', adapter, 'preferred_palette')).toBe('forest');
    expect(adapter.values.get('preferred_palette')).toBe('forest');
  });

  it('falls back when stored palette data is not a supported option', () => {
    const adapter = createStorageAdapter({ preferred_palette: 'sunset' });

    expect(readStoredThemePalette(adapter, 'preferred_palette')).toBe('default');
    expect(isThemePalette('default')).toBe(true);
    expect(isThemePalette('aurora')).toBe(true);
    expect(isThemePalette('forest')).toBe(true);
    expect(isThemePalette('sunset')).toBe(false);
  });

  it('keeps theme mode values narrowed to the supported union', () => {
    const mode: ThemeMode = readStoredThemeMode(
      createStorageAdapter({ preferred_theme: 'light' }),
      'preferred_theme'
    );

    expect(mode).toBe('light');
  });

  it('keeps palette values narrowed to the supported union', () => {
    const palette: ThemePalette = readStoredThemePalette(
      createStorageAdapter({ preferred_palette: 'forest' }),
      'preferred_palette'
    );

    expect(THEME_PALETTES).toEqual(['default', 'aurora', 'forest']);
    expect(palette).toBe('forest');
  });
});
