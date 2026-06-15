import { useSyncExternalStore } from 'react';

import {
  DEFAULT_UI_PREFERENCES,
  getUiPreferencesSnapshot,
  subscribeUiPreferences
} from '../stores/uiPreferencesStore';

export default function useUiPreferences() {
  return useSyncExternalStore(
    subscribeUiPreferences,
    getUiPreferencesSnapshot,
    () => DEFAULT_UI_PREFERENCES
  );
}
