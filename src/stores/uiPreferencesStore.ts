import { THEME_STORAGE_KEY } from '../constants/settings';

export type ThemeMode = 'light' | 'dark';

export interface UiPreferencesState {
  themeMode: ThemeMode;
  chatWidgetOpen: boolean;
  preferencesReady: boolean;
}

export interface UiPreferenceStorageAdapter {
  get<T = unknown>(key: string): T | string | null;
  set<T = unknown>(key: string, value: T): void;
}

export type UiPreferencesListener = () => void;

export const DEFAULT_UI_PREFERENCES: Readonly<UiPreferencesState> = Object.freeze({
  themeMode: 'light',
  chatWidgetOpen: false,
  preferencesReady: false
});

let state: Readonly<UiPreferencesState> = DEFAULT_UI_PREFERENCES;
const listeners = new Set<UiPreferencesListener>();

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function getUiPreferencesSnapshot(): Readonly<UiPreferencesState> {
  return state;
}

export function subscribeUiPreferences(listener: UiPreferencesListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setThemeMode(themeMode: ThemeMode): Readonly<UiPreferencesState> {
  return updateUiPreferences({ themeMode });
}

export function setChatWidgetOpen(chatWidgetOpen: boolean): Readonly<UiPreferencesState> {
  return updateUiPreferences({ chatWidgetOpen });
}

export function setPreferencesReady(preferencesReady: boolean): Readonly<UiPreferencesState> {
  return updateUiPreferences({ preferencesReady });
}

export function initializeUiPreferences(
  nextState: Partial<UiPreferencesState> = {}
): Readonly<UiPreferencesState> {
  const next: Partial<UiPreferencesState> = {};

  if (isThemeMode(nextState.themeMode)) {
    next.themeMode = nextState.themeMode;
  }

  if (typeof nextState.chatWidgetOpen === 'boolean') {
    next.chatWidgetOpen = nextState.chatWidgetOpen;
  }

  if (typeof nextState.preferencesReady === 'boolean') {
    next.preferencesReady = nextState.preferencesReady;
  }

  return updateUiPreferences(next);
}

export function readStoredThemeMode(
  adapter: UiPreferenceStorageAdapter,
  key = THEME_STORAGE_KEY,
  fallback: ThemeMode = DEFAULT_UI_PREFERENCES.themeMode
): ThemeMode {
  const storedTheme = adapter.get<ThemeMode>(key);
  return isThemeMode(storedTheme) ? storedTheme : fallback;
}

export function persistThemeMode(
  themeMode: ThemeMode,
  adapter: UiPreferenceStorageAdapter,
  key = THEME_STORAGE_KEY
): ThemeMode {
  adapter.set(key, themeMode);
  return themeMode;
}

export function resetUiPreferencesForTests(): void {
  state = DEFAULT_UI_PREFERENCES;
  listeners.clear();
}

function updateUiPreferences(nextState: Partial<UiPreferencesState>): Readonly<UiPreferencesState> {
  const next = { ...state, ...nextState };

  if (
    next.themeMode === state.themeMode &&
    next.chatWidgetOpen === state.chatWidgetOpen &&
    next.preferencesReady === state.preferencesReady
  ) {
    return state;
  }

  state = next;
  notifyListeners();
  return state;
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}
