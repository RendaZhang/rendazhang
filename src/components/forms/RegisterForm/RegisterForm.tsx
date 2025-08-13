import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  LOGIN_PAGE_PATH,
  LOADING_TEXT,
  AUTH_TIMINGS,
  REGISTER_DRAFT_KEY
} from '../../../constants';
import { useLanguage } from '../../providers';
import { REGISTER_CONTENT, AUTH_ERROR_CONTENT } from '../../../content';
import { LocalizedSection } from '../../ui';
import { useFormValidation, usePasswordStrength } from '../../../hooks';
import { validatePasswordComplexity } from '../../../utils/password';
import { storage } from '../../../utils';
import { apiClient } from '../../../services';

interface RegisterFormValues {
  email: string;
  username: string;
  password: string;
  confirm: string;
  agree: boolean;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type RegisterTexts = typeof REGISTER_CONTENT;

interface RegisterFormProps {
  texts?: RegisterTexts;
}

interface RegisterPlaceholders {
  email: string;
  username: string;
  password: string;
  confirm: string;
}

export default function RegisterForm({ texts = REGISTER_CONTENT }: RegisterFormProps) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [globalError, setGlobalError] = useState<string>('');
  const [placeholders, setPlaceholders] = useState<RegisterPlaceholders>({
    email: '',
    username: '',
    password: '',
    confirm: ''
  });

  const { values, errors, handleChange, validateAll } = useFormValidation<RegisterFormValues>(
    { email: '', username: '', password: '', confirm: '', agree: false },
    {
      email: (value) => {
        if (!value) return activeTexts.errors?.emailRequired || '邮箱不能为空';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return activeTexts.errors?.emailInvalid || '邮箱格式错误';
        }
        return '';
      },
      username: (value) => (!value ? activeTexts.errors?.usernameRequired || '用户名不能为空' : ''),
      password: (value) => {
        if (!value) return activeTexts.errors?.passwordRequired || '密码不能为空';
        if (!validatePasswordComplexity(value))
          return (
            activeTexts.errors?.passwordInvalid || '密码至少8位，包含字母、数字或特殊符号中的两种'
          );
        return '';
      },
      confirm: (value, all) =>
        value !== all.password ? activeTexts.errors?.passwordMismatch || '两次密码不一致' : '',
      agree: (value) => (!value ? activeTexts.errors?.agreement || '请勾选同意' : '')
    }
  );
  const { email, username, password, confirm, agree } = values;

  useEffect(() => {
    const saved = storage.get(REGISTER_DRAFT_KEY) as Partial<RegisterFormValues> | null;
    if (saved) {
      if (saved.email) handleChange('email', saved.email);
      if (saved.username) handleChange('username', saved.username);
    }
  }, []);

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  useEffect(() => {
    if (email || username) {
      storage.set(REGISTER_DRAFT_KEY, { email, username });
    } else {
      storage.remove(REGISTER_DRAFT_KEY);
    }
  }, [email, username]);

  const strength = usePasswordStrength(password);

  const canSubmit: boolean =
    Boolean(email && username && password && confirm && agree) && Object.keys(errors).length === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus('loading');
    setProgress(0);
    setGlobalError('');
    const step = AUTH_TIMINGS.REGISTER_PROGRESS_STEP;
    const i = setInterval(() => {
      setProgress((p) => Math.min(90, p + step));
    }, AUTH_TIMINGS.REGISTER_PROGRESS_INTERVAL);
    try {
      await apiClient.auth.register({ email, password, display_name: username });
      clearInterval(i);
      setProgress(100);
      storage.remove(REGISTER_DRAFT_KEY);
      setStatus('success');
      setTimeout(() => {
        window.location.href = LOGIN_PAGE_PATH;
      }, AUTH_TIMINGS.REGISTER_REDIRECT);
    } catch (err) {
      clearInterval(i);
      setProgress(0);
      setStatus('error');
      const {
        status,
        error: code,
        message
      } = err as {
        status?: number;
        error?: string;
        message: string;
      };
      const authTexts = AUTH_ERROR_CONTENT[langKey] || {};
      const key = (status ?? code ?? 'default').toString();
      const localized = authTexts[key as keyof typeof authTexts] || authTexts.default || message;
      setGlobalError(localized);
    }
  };

  const passwordStrengthClass = strength
    ? `c-password-strength is-${strength}`
    : 'c-password-strength';

  return (
    <div className="c-register-container">
      <form onSubmit={handleSubmit} className="c-register-form">
        <h1 className="c-register-title">
          <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
        </h1>
        {globalError && <div className="c-global-error">{globalError}</div>}
        <div className="c-form-group">
          <label htmlFor="email" className="c-form-label">
            <LocalizedSection zhContent={textsZh.emailLabel} enContent={textsEn.emailLabel} />
          </label>
          <input
            id="email"
            type="email"
            className={`c-form-control ${errors.email ? 'is-invalid' : email ? 'is-valid' : ''}`}
            placeholder={placeholders.email}
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          {errors.email && <div className="c-invalid-feedback">{errors.email}</div>}
        </div>
        <div className="c-form-group">
          <label htmlFor="username" className="c-form-label">
            <LocalizedSection zhContent={textsZh.usernameLabel} enContent={textsEn.usernameLabel} />
          </label>
          <input
            id="username"
            type="text"
            className={`c-form-control ${errors.username ? 'is-invalid' : username ? 'is-valid' : ''}`}
            placeholder={placeholders.username}
            value={username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
          />
          {errors.username && <div className="c-invalid-feedback">{errors.username}</div>}
          {!errors.username && username && (
            <div className="c-valid-feedback">
              <LocalizedSection
                zhContent={textsZh.usernameAvailable}
                enContent={textsEn.usernameAvailable}
              />
            </div>
          )}
        </div>
        <div className="u-grid-row">
          <div className="u-grid-col-sm-6 c-password-wrapper">
            <label htmlFor="password" className="c-form-label">
              <LocalizedSection
                zhContent={textsZh.passwordLabel}
                enContent={textsEn.passwordLabel}
              />
            </label>
            <div className="c-password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="c-form-control"
                placeholder={placeholders.password}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <span className="c-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className={passwordStrengthClass}></div>
            {strength && (
              <div className="c-password-strength-label">
                <LocalizedSection
                  zhContent={textsZh.strength[strength as 'weak' | 'medium' | 'strong']}
                  enContent={textsEn.strength[strength as 'weak' | 'medium' | 'strong']}
                />
              </div>
            )}
          </div>
          <div className="u-grid-col-sm-6">
            <label htmlFor="confirm" className="c-form-label">
              <LocalizedSection zhContent={textsZh.confirmLabel} enContent={textsEn.confirmLabel} />
            </label>
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              className={`c-form-control ${errors.confirm ? 'is-invalid' : confirm ? 'is-valid' : ''}`}
              placeholder={placeholders.confirm}
              value={confirm}
              onChange={(e) => handleChange('confirm', e.target.value)}
              required
            />
            {errors.confirm && <div className="c-invalid-feedback">{errors.confirm}</div>}
          </div>
        </div>
        <div className="c-form-text">
          <LocalizedSection zhContent={textsZh.passwordHint} enContent={textsEn.passwordHint} />
        </div>
        <div className="c-form-check c-form-check--spaced">
          <input
            id="agree"
            className="c-form-check-input"
            type="checkbox"
            checked={agree}
            onChange={(e) => handleChange('agree', e.target.checked)}
            required
          />
          <label htmlFor="agree" className="c-form-check-label">
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
        <div className="c-progress-container">
          <div className="c-progress-bar" style={{ width: progress + '%' }}></div>
        </div>
        <button
          type="submit"
          className="c-btn-primary u-w-100 c-form-submit"
          disabled={!canSubmit || status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
          ) : status === 'success' ? (
            <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
          ) : (
            <LocalizedSection
              zhContent={textsZh.registerButton}
              enContent={textsEn.registerButton}
            />
          )}
        </button>
        <div className="c-third-party">
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
        <div className="u-text-center c-form-alt">
          <LocalizedSection zhContent={textsZh.existingUser} enContent={textsEn.existingUser} />{' '}
          <a href={LOGIN_PAGE_PATH}>
            <LocalizedSection zhContent={textsZh.loginNow} enContent={textsEn.loginNow} />
          </a>
        </div>
      </form>
    </div>
  );
}
