import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { HOME_PAGE_PATH, LOGIN_PAGE_PATH, REGISTER_PAGE_PATH } from '../config.js';

export default function NavBar() {
  return (
    <nav>
      <a href={HOME_PAGE_PATH}>Home</a>
      <a href={LOGIN_PAGE_PATH}>登录</a>
      <a href={REGISTER_PAGE_PATH}>Register</a>
      <ThemeToggle />
    </nav>
  );
}
