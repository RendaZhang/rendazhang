import React, { useState, useEffect } from 'react';
import { LOGIN_PAGE_PATH } from '../config.js';

export default function RegisterForm() {
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
    localStorage.setItem('register_draft', JSON.stringify({ email, username }));
  }, [email, username]);

  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('邮箱格式错误');
    } else if (email) {
      setEmailError('检查中...');
      const t = setTimeout(() => {
        if (email.toLowerCase() === 'taken@example.com') {
          setEmailError(
            <>
              该邮箱已注册？<a href={LOGIN_PAGE_PATH}>立即登录</a>
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
  }, [email]);

  useEffect(() => {
    if (username) {
      setUsernameError('检查中...');
      const t = setTimeout(() => {
        if (username.toLowerCase() === 'taken') {
          setUsernameError('用户名已被占用');
        } else {
          setUsernameError('');
        }
      }, 500);
      return () => clearTimeout(t);
    } else {
      setUsernameError('');
    }
  }, [username]);

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
      setConfirmError('两次密码不一致');
    } else {
      setConfirmError('');
    }
  }, [confirm, password]);

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
      <h1 className="register-title">开启您的旅程</h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${emailError ? 'is-invalid' : email ? 'is-valid' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <div className="invalid-feedback">{emailError}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          用户名
        </label>
        <input
          id="username"
          type="text"
          className={`form-control ${usernameError ? 'is-invalid' : username ? 'is-valid' : ''}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {usernameError && <div className="invalid-feedback">{usernameError}</div>}
        {!usernameError && username && <div className="valid-feedback">✓ 可用</div>}
      </div>
      <div className="row g-3">
        <div className="col-sm-6 password-wrapper">
          <label htmlFor="password" className="form-label">
            密码
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
          <div className={passwordStrengthClass}></div>
        </div>
        <div className="col-sm-6">
          <label htmlFor="confirm" className="form-label">
            确认密码
          </label>
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${confirmError ? 'is-invalid' : confirm ? 'is-valid' : ''}`}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {confirmError && <div className="invalid-feedback">{confirmError}</div>}
        </div>
      </div>
      <div className="form-text mt-2">至少8字符，含大小写+数字</div>
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
          我已阅读并同意 <a href="#">用户协议</a>
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
        {status === 'loading' ? '注册中...' : status === 'success' ? '成功' : '注册'}
      </button>
      <div className="third-party">
        <button type="button" aria-label="Google 注册">
          G
        </button>
        <button type="button" aria-label="Apple 注册">
          
        </button>
      </div>
      <div className="text-center mt-3">
        已有账号？ <a href={LOGIN_PAGE_PATH}>登录</a>
      </div>
    </form>
  );
}
