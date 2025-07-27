import React, { useState, useEffect } from 'react';
import { HOME_PAGE_PATH, REGISTER_PAGE_PATH, LOADING_TEXT } from '../config.js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [strength, setStrength] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    // email validation
    if (email && !email.includes('@')) {
      setEmailError('邮箱格式错误');
    } else {
      setEmailError('');
    }
  }, [email]);

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
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    if (!email) {
      setEmailError('邮箱不能为空');
      valid = false;
    }
    if (!password) {
      setPasswordError('密码不能为空');
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
      setGlobalError('账号或密码错误');
      setStatus('error');
    }
  };

  const passwordStrengthClass = strength ? `password-strength ${strength}` : 'password-strength';

  return (
    <form onSubmit={handleSubmit} className="login-container">
      <h1 className="login-title">欢迎回来</h1>
      {globalError && <div className="global-error">{globalError}</div>}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          邮箱或用户名
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${emailError ? 'is-invalid' : ''}`}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        {emailError && <div className="invalid-feedback">{emailError}</div>}
      </div>
      <div className="mb-3 password-wrapper">
        <label htmlFor="password" className="form-label">
          密码
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className={`form-control ${passwordError ? 'is-invalid' : ''}`}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="password-toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label="切换密码可见性"
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
        <div className={passwordStrengthClass}></div>
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
            记住我
          </label>
        </div>
        <a href="/reset" className="small">
          忘记密码？
        </a>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? LOADING_TEXT : status === 'success' ? '成功' : '登录'}
      </button>
      <div className="third-party">
        <button type="button" aria-label="Google 登录">
          G
        </button>
        <button type="button" aria-label="GitHub 登录">
          GH
        </button>
      </div>
      <div className="text-center mt-3">
        新用户？ <a href={REGISTER_PAGE_PATH}>立即注册</a>
      </div>
    </form>
  );
}
