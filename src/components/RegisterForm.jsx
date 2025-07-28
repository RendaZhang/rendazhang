import React, { useState, useEffect } from 'react';
import { LOGIN_PAGE_PATH, LOADING_TEXT } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { REGISTER_CONTENT } from '../content/registerContent.js';

export default function RegisterForm({ texts = REGISTER_CONTENT }) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [strength, setStrength] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [placeholders, setPlaceholders] = useState({
    email: '',
    username: '',
    password: '',
    confirm: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('register_draft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setEmail(data.email || '');
        setUsername(data.username || '');
      } catch {}
    }
  }, []);

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  useEffect(() => {
    localStorage.setItem('register_draft', JSON.stringify({ email, username }));
  }, [email, username]);

  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(activeTexts.errors?.emailInvalid || '邮箱格式错误');
    } else if (email) {
      setEmailError(activeTexts.checking || '检查中...');
      const t = setTimeout(() => {
        if (email.toLowerCase() === 'taken@example.com') {
          setEmailError(
            <>
              {activeTexts.emailTakenPrefix}
              <a href={LOGIN_PAGE_PATH}>{activeTexts.loginNow}</a>
            </>
          );
        } else {
          setEmailError('');
        }
      }, 500);
      return () => clearTimeout(t);
    } else {
      setEmailError('');
    }
  }, [email, activeTexts]);

  useEffect(() => {
    if (username) {
      setUsernameError(activeTexts.checking || '检查中...');
      const t = setTimeout(() => {
        if (username.toLowerCase() === 'taken') {
          setUsernameError(activeTexts.errors?.usernameTaken || '用户名已被占用');
        } else {
          setUsernameError('');
        }
      }, 500);
      return () => clearTimeout(t);
    } else {
      setUsernameError('');
    }
  }, [username, activeTexts]);

  useEffect(() => {
    if (!password) {
      setStrength('');
    } else if (password.length < 8) {
      setStrength('weak');
    } else if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
      setStrength('strong');
    } else {
      setStrength('medium');
    }
  }, [password]);

  useEffect(() => {
    if (confirm && confirm !== password) {
      setConfirmError(activeTexts.errors?.passwordMismatch || '两次密码不一致');
    } else {
      setConfirmError('');
    }
  }, [confirm, password, activeTexts]);

  const canSubmit =
    email && username && password && !emailError && !usernameError && !confirmError && agree;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading');
    setProgress(0);
    const step = 33;
    const i = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, 500);
    await new Promise((r) => setTimeout(r, 1600));
    clearInterval(i);
    setProgress(100);
    setStatus('success');
    setTimeout(() => {
      window.location.href = LOGIN_PAGE_PATH;
    }, 5000);
  };

  const passwordStrengthClass = strength ? `password-strength ${strength}` : 'password-strength';

  return (
    <form onSubmit={handleSubmit} className="register-container">
      <h1 className="register-title">
        <span className="lang-zh">{textsZh.title}</span>
        <span className="lang-en">{textsEn.title}</span>
      </h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <span className="lang-zh">{textsZh.emailLabel}</span>
          <span className="lang-en">{textsEn.emailLabel}</span>
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${emailError ? 'is-invalid' : email ? 'is-valid' : ''}`}
          placeholder={placeholders.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <div className="invalid-feedback">{emailError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          <span className="lang-zh">{textsZh.usernameLabel}</span>
          <span className="lang-en">{textsEn.usernameLabel}</span>
        </label>
        <input
          id="username"
          type="text"
          className={`form-control ${usernameError ? 'is-invalid' : username ? 'is-valid' : ''}`}
          placeholder={placeholders.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {usernameError && <div className="invalid-feedback">{usernameError}</div>}
        {!usernameError && username && (
          <div className="valid-feedback">
            <span className="lang-zh">{textsZh.usernameAvailable}</span>
            <span className="lang-en">{textsEn.usernameAvailable}</span>
          </div>
        )}
      </div>
      <div className="row g-3">
        <div className="col-sm-6 password-wrapper">
          <label htmlFor="password" className="form-label">
            <span className="lang-zh">{textsZh.passwordLabel}</span>
            <span className="lang-en">{textsEn.passwordLabel}</span>
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            placeholder={placeholders.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
          <div className={passwordStrengthClass}></div>
          {strength && (
            <div className="password-strength-label">
              <span className="lang-zh">{textsZh.strength[strength]}</span>
              <span className="lang-en">{textsEn.strength[strength]}</span>
            </div>
          )}
        </div>
        <div className="col-sm-6">
          <label htmlFor="confirm" className="form-label">
            <span className="lang-zh">{textsZh.confirmLabel}</span>
            <span className="lang-en">{textsEn.confirmLabel}</span>
          </label>
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${confirmError ? 'is-invalid' : confirm ? 'is-valid' : ''}`}
            placeholder={placeholders.confirm}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {confirmError && <div className="invalid-feedback">{confirmError}</div>}
        </div>
      </div>
      <div className="form-text mt-2">
        <span className="lang-zh">{textsZh.passwordHint}</span>
        <span className="lang-en">{textsEn.passwordHint}</span>
      </div>
      <div className="form-check mt-3">
        <input
          id="agree"
          className="form-check-input"
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
        />
        <label htmlFor="agree" className="form-check-label">
          <span className="lang-zh">
            {textsZh.agreePrefix} <a href="#">{textsZh.agreementLink}</a>
          </span>
          <span className="lang-en">
            {textsEn.agreePrefix}
            <a href="#">{textsEn.agreementLink}</a>
          </span>
        </label>
      </div>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: progress + '%' }}></div>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-3"
        disabled={!canSubmit || status === 'loading' || status === 'success'}
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
            <span className="lang-zh">{textsZh.registerButton}</span>
            <span className="lang-en">{textsEn.registerButton}</span>
          </>
        )}
      </button>
      <div className="third-party">
        <button type="button" aria-label={activeTexts.thirdParty.google}>
          <span className="lang-zh">{textsZh.thirdParty.google}</span>
          <span className="lang-en">{textsEn.thirdParty.google}</span>
        </button>
        <button type="button" aria-label={activeTexts.thirdParty.apple}>
          <span className="lang-zh">{textsZh.thirdParty.apple}</span>
          <span className="lang-en">{textsEn.thirdParty.apple}</span>
        </button>
      </div>
      <div className="text-center mt-3">
        <span className="lang-zh">{textsZh.existingUser}</span>
        <span className="lang-en">{textsEn.existingUser}</span>{' '}
        <a href={LOGIN_PAGE_PATH}>
          <span className="lang-zh">{textsZh.loginNow}</span>
          <span className="lang-en">{textsEn.loginNow}</span>
        </a>
      </div>
    </form>
  );
}
