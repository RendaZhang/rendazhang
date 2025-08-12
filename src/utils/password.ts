export type PasswordStrength = '' | 'weak' | 'medium' | 'strong';

const LETTER_RE = /[A-Za-z]/;
const NUMBER_RE = /\d/;
const SPECIAL_RE = /[^A-Za-z0-9]/;

export function validatePasswordComplexity(password: string): boolean {
  if (!password || password.length < 8) return false;
  let types = 0;
  if (LETTER_RE.test(password)) types++;
  if (NUMBER_RE.test(password)) types++;
  if (SPECIAL_RE.test(password)) types++;
  return types >= 2;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return '';
  if (password.length < 8) return 'weak';
  let types = 0;
  if (LETTER_RE.test(password)) types++;
  if (NUMBER_RE.test(password)) types++;
  if (SPECIAL_RE.test(password)) types++;
  if (types <= 1) return 'weak';
  if (types === 2) return 'medium';
  return 'strong';
}
