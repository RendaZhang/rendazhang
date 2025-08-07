import { LoginForm } from '../forms';
import { LOGIN_CONTENT } from '../../content';
import type { ReactElement } from 'react';

export default function LoginContent(): ReactElement {
  return <LoginForm texts={LOGIN_CONTENT} />;
}
