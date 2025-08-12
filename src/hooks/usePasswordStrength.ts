import { useMemo } from 'react';
import { getPasswordStrength, type PasswordStrength } from '../utils/password';

export default function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => getPasswordStrength(password), [password]);
}
