import { describe, expect, it } from 'vitest';
import { shouldSuppressAuthProbeError } from '../utils/auth';

describe('auth utilities', () => {
  it('suppresses missing local auth probes only outside production', () => {
    expect(shouldSuppressAuthProbeError(404, false)).toBe(true);
    expect(shouldSuppressAuthProbeError(404, true)).toBe(false);
    expect(shouldSuppressAuthProbeError(401, false)).toBe(false);
    expect(shouldSuppressAuthProbeError(undefined, false)).toBe(false);
  });
});
