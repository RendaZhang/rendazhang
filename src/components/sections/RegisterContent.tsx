import { RegisterForm } from '../forms';
import { REGISTER_CONTENT } from '../../content';
import type { ReactElement } from 'react';

export default function RegisterContent(): ReactElement {
  return <RegisterForm texts={REGISTER_CONTENT} />;
}
