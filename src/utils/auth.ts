import { isProduction } from './env';

export function shouldSuppressAuthProbeError(
  status: number | undefined,
  production = isProduction()
): boolean {
  return status === 404 && !production;
}
