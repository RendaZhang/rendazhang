import { beforeEach, describe, expect, it } from 'vitest';
import { LOGIN_STATE_KEY } from '../constants';
import { hasStoredLoginSignal, shouldSuppressAuthProbeError } from '../utils/auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('suppresses missing local auth probes only outside production', () => {
    expect(shouldSuppressAuthProbeError(404, false)).toBe(true);
    expect(shouldSuppressAuthProbeError(404, true)).toBe(false);
    expect(shouldSuppressAuthProbeError(401, false)).toBe(false);
    expect(shouldSuppressAuthProbeError(undefined, false)).toBe(false);
  });

  it('detects only explicit stored login signals', () => {
    localStorage.removeItem(LOGIN_STATE_KEY);
    expect(hasStoredLoginSignal()).toBe(false);

    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(true));
    expect(hasStoredLoginSignal()).toBe(true);

    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify('true'));
    expect(hasStoredLoginSignal()).toBe(true);

    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify(false));
    expect(hasStoredLoginSignal()).toBe(false);

    localStorage.setItem(LOGIN_STATE_KEY, JSON.stringify('false'));
    expect(hasStoredLoginSignal()).toBe(false);
  });
});
