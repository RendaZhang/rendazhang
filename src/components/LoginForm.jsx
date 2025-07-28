import React, { useState, useEffect } from 'react';
import { HOME_PAGE_PATH, REGISTER_PAGE_PATH, LOADING_TEXT } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LOGIN_CONTENT } from '../content/loginContent.js';

export default function LoginForm({ texts = LOGIN_CONTENT }) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [strength, setStrength] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [placeholders, setPlaceholders] = useState({ email: '', password: '' });

  useEffect(() => {
    // email validation
    if (email && !email.includes('@')) {
      setEmailError(activeTexts.errors?.emailInvalid || '邮箱格式错误');
    } else {
      setEmailError('');
    }
  }, [email, activeTexts]);

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  useEffect(() => {
    // password strength
    if (!password) {
      setStrength('');
    } else if (password.length < 6) {
      setStrength('weak');
    } else if (password.length < 10) {
      setStrength('medium');
    } else {
      setStrength('strong');
    }
    if (password) {
      setPasswordError('');
    }
  }, [password, activeTexts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!email) {
      setEmailError(activeTexts.errors?.emailRequired || '邮箱不能为空');
      valid = false;
    }
    if (!password) {
      setPasswordError(activeTexts.errors?.passwordRequired || '密码不能为空');
      valid = false;
    }
    if (!valid) return;

    try {
      setStatus('loading');
      // fake async login
      await new Promise((res) => setTimeout(res, 1000));
      setStatus('success');
      setTimeout(() => {
        window.location.href = HOME_PAGE_PATH + '/';
      }, 3000);
    } catch (err) {
      setGlobalError(activeTexts.errors?.credentials || '账号或密码错误');
      setStatus('error');
    }
  };

  const passwordStrengthClass = strength ? `password-strength ${strength}` : 'password-strength';

  return (
    <form onSubmit={handleSubmit} className="login-container">
      <h1 className="login-title">
        <span className="lang-zh">{textsZh.title}</span>
        <span className="lang-en">{textsEn.title}</span>
      </h1>
      {globalError && <div className="global-error">{globalError}</div>}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <span className="lang-zh">{textsZh.emailLabel}</span>
          <span className="lang-en">{textsEn.emailLabel}</span>
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${emailError ? 'is-invalid' : ''}`}
          placeholder={placeholders.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        {emailError && <div className="invalid-feedback">{emailError}</div>}
      </div>
      <div className="mb-3 password-wrapper">
        <label htmlFor="password" className="form-label">
          <span className="lang-zh">{textsZh.passwordLabel}</span>
          <span className="lang-en">{textsEn.passwordLabel}</span>
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className={`form-control ${passwordError ? 'is-invalid' : ''}`}
          placeholder={placeholders.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="password-toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={
            showPassword ? activeTexts.passwordToggle.hide : activeTexts.passwordToggle.show
          }
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
        <div className={passwordStrengthClass}></div>
        {strength && (
          <div className="password-strength-label">
            <span className="lang-zh">{textsZh.strength[strength]}</span>
            <span className="lang-en">{textsEn.strength[strength]}</span>
          </div>
        )}
        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
      </div>
      <div className="mb-3 form-check d-flex justify-content-between">
        <div>
          <input
            id="remember"
            type="checkbox"
            className="form-check-input"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember" className="form-check-label ms-2">
            <span className="lang-zh">{textsZh.remember}</span>
            <span className="lang-en">{textsEn.remember}</span>
          </label>
        </div>
        <a href="/reset" className="small">
          <span className="lang-zh">{textsZh.forgot}</span>
          <span className="lang-en">{textsEn.forgot}</span>
        </a>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? (
          LOADING_TEXT
        ) : status === 'success' ? (
          <>
            <span className="lang-zh">{textsZh.success}</span>
            <span className="lang-en">{textsEn.success}</span>
          </>
        ) : (
          <>
            <span className="lang-zh">{textsZh.loginButton}</span>
            <span className="lang-en">{textsEn.loginButton}</span>
          </>
        )}
      </button>
      <div className="third-party">
        <button type="button" aria-label={activeTexts.thirdParty.google}>
          <span className="lang-zh">{textsZh.thirdParty.google}</span>
          <span className="lang-en">{textsEn.thirdParty.google}</span>
        </button>
        <button type="button" aria-label={activeTexts.thirdParty.github}>
          <span className="lang-zh">{textsZh.thirdParty.github}</span>
          <span className="lang-en">{textsEn.thirdParty.github}</span>
        </button>
      </div>
      <div className="text-center mt-3">
        <span className="lang-zh">{textsZh.newUser}</span>
        <span className="lang-en">{textsEn.newUser}</span>{' '}
        <a href={REGISTER_PAGE_PATH}>
          <span className="lang-zh">{textsZh.registerNow}</span>
          <span className="lang-en">{textsEn.registerNow}</span>
        </a>
      </div>
    </form>
  );
}
