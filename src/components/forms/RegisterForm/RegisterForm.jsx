import { useState, useEffect } from 'react';
import {
  LOGIN_PAGE_PATH,
  LOADING_TEXT,
  AUTH_TIMINGS,
  REGISTER_DRAFT_KEY
} from '../../../config.js';
import { useLanguage } from '../../providers';
import { REGISTER_CONTENT } from '../../../content';
import { LocalizedSection } from '../../ui';

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
    const saved = localStorage.getItem(REGISTER_DRAFT_KEY);
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
    localStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify({ email, username }));
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
      }, AUTH_TIMINGS.REGISTER_VALIDATE);
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
      }, AUTH_TIMINGS.REGISTER_VALIDATE);
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
    const step = AUTH_TIMINGS.REGISTER_PROGRESS_STEP;
    const i = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, AUTH_TIMINGS.REGISTER_PROGRESS_INTERVAL);
    await new Promise((r) => setTimeout(r, AUTH_TIMINGS.REGISTER_PROGRESS_TOTAL));
    clearInterval(i);
    setProgress(100);
    setStatus('success');
    setTimeout(() => {
      window.location.href = LOGIN_PAGE_PATH;
    }, AUTH_TIMINGS.REGISTER_REDIRECT);
  };

  const passwordStrengthClass = strength ? `password-strength ${strength}` : 'password-strength';

  return (
    <form onSubmit={handleSubmit} className="register-container">
      <h1 className="register-title">
        <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
      </h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <LocalizedSection zhContent={textsZh.emailLabel} enContent={textsEn.emailLabel} />
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
          <LocalizedSection zhContent={textsZh.usernameLabel} enContent={textsEn.usernameLabel} />
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
            <LocalizedSection
              zhContent={textsZh.usernameAvailable}
              enContent={textsEn.usernameAvailable}
            />
          </div>
        )}
      </div>
      <div className="grid-row">
        <div className="grid-col-sm-6 password-wrapper">
          <label htmlFor="password" className="form-label">
            <LocalizedSection zhContent={textsZh.passwordLabel} enContent={textsEn.passwordLabel} />
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
              <LocalizedSection
                zhContent={textsZh.strength[strength]}
                enContent={textsEn.strength[strength]}
              />
            </div>
          )}
        </div>
        <div className="grid-col-sm-6">
          <label htmlFor="confirm" className="form-label">
            <LocalizedSection zhContent={textsZh.confirmLabel} enContent={textsEn.confirmLabel} />
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
        <LocalizedSection zhContent={textsZh.passwordHint} enContent={textsEn.passwordHint} />
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
          <LocalizedSection
            zhContent={
              <>
                {textsZh.agreePrefix} <a href="#">{textsZh.agreementLink}</a>
              </>
            }
            enContent={
              <>
                {textsEn.agreePrefix}
                <a href="#">{textsEn.agreementLink}</a>
              </>
            }
          />
        </label>
      </div>
      <div className="progress-container mt-3">
        <div className="progress-bar" style={{ width: progress + '%' }}></div>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-3"
        disabled={!canSubmit || status === 'loading' || status === 'success'}
      >
        {status === 'loading' ? (
          <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
        ) : status === 'success' ? (
          <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
        ) : (
          <LocalizedSection zhContent={textsZh.registerButton} enContent={textsEn.registerButton} />
        )}
      </button>
      <div className="third-party">
        <button type="button" aria-label={activeTexts.thirdParty.google}>
          <LocalizedSection
            zhContent={textsZh.thirdParty.google}
            enContent={textsEn.thirdParty.google}
          />
        </button>
        <button type="button" aria-label={activeTexts.thirdParty.apple}>
          <LocalizedSection
            zhContent={textsZh.thirdParty.apple}
            enContent={textsEn.thirdParty.apple}
          />
        </button>
      </div>
      <div className="text-center mt-3">
        <LocalizedSection zhContent={textsZh.existingUser} enContent={textsEn.existingUser} />{' '}
        <a href={LOGIN_PAGE_PATH}>
          <LocalizedSection zhContent={textsZh.loginNow} enContent={textsEn.loginNow} />
        </a>
      </div>
    </form>
  );
}
