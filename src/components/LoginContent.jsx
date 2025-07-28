import React from 'react';
import LoginForm from './LoginForm.jsx';
import { LOGIN_CONTENT } from '../content/loginContent.js';

export default function LoginContent() {
  return <LoginForm texts={LOGIN_CONTENT} />;
}
