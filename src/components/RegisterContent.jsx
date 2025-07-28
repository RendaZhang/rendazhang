import React from 'react';
import RegisterForm from './RegisterForm.jsx';
import { REGISTER_CONTENT } from '../content/registerContent.js';

export default function RegisterContent() {
  return <RegisterForm texts={REGISTER_CONTENT} />;
}
