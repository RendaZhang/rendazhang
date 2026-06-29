import { isProduction } from './env';
import { LOGIN_STATE_KEY } from '../constants';
import storage from './storage';

export function shouldSuppressAuthProbeError(
  status: number | undefined,
  production = isProduction()
): boolean {
  return status === 404 && !production;
}

export function hasStoredLoginSignal(): boolean {
  const loginState = storage.get<boolean | string>(LOGIN_STATE_KEY);
  return loginState === true || loginState === 'true';
}
