import { useState, useEffect } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  LOGIN_PAGE_PATH,
  LOADING_TEXT,
  AUTH_TIMINGS,
  REGISTER_DRAFT_KEY
} from '../../../constants';
import { useLanguage } from '../../providers';
import { REGISTER_CONTENT, AUTH_ERROR_CONTENT } from '../../../content';
import { LocalizedSection, AuthOverlay } from '../../ui';
import { useFormValidation, usePasswordStrength } from '../../../hooks';
import { validatePasswordComplexity } from '../../../utils/password';
import { storage } from '../../../utils';
import { apiClient } from '../../../services';
import AccountPanel, { focusFirstAccountError } from '../AccountPanel';
import AccountForm from '../AccountForm';
import AccountPasswordIcon from '../AccountPasswordIcon';

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
  // Single toggle controls visibility for both password fields
  const togglePassword = (): void => setShowPassword((v) => !v);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [globalError, setGlobalError] = useState<ReactNode>('');
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
  const confirmError = confirm && confirm !== password ? activeTexts.errors.passwordMismatch : '';

  useEffect(() => {
    // Restore draft values if the user partially completed the form earlier
    const saved = storage.get(REGISTER_DRAFT_KEY) as Partial<RegisterFormValues> | null;
    if (saved) {
      if (saved.email) handleChange('email', saved.email);
      if (saved.username) handleChange('username', saved.username);
    }
  }, []);

  useEffect(() => {
    // Update placeholder texts when language or external texts change
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  useEffect(() => {
    // Persist draft values so accidental navigation doesn't lose progress
    if (email || username) {
      storage.set(REGISTER_DRAFT_KEY, { email, username });
    } else {
      storage.remove(REGISTER_DRAFT_KEY);
    }
  }, [email, username]);

  const strength = usePasswordStrength(password);

  const canSubmit =
    Boolean(email && username && agree) &&
    validatePasswordComplexity(password) &&
    password === confirm &&
    !errors.email &&
    !errors.username;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (status === 'loading' || status === 'success') return;
    if (!validateAll()) {
      focusFirstAccountError(e.currentTarget);
      return;
    }
    setStatus('loading');
    setProgress(0);
    setGlobalError('');
    // Increment fake progress bar while waiting for server response
    const step = AUTH_TIMINGS.REGISTER_PROGRESS_STEP;
    const i = setInterval(() => {
      setProgress((p) => Math.min(90, p + step));
    }, AUTH_TIMINGS.REGISTER_PROGRESS_INTERVAL);
    try {
      const emailNormalized = email.trim().toLowerCase();
      const usernameNormalized = username.trim();
      await apiClient.auth.register({
        email: emailNormalized,
        password,
        display_name: usernameNormalized
      });
      clearInterval(i);
      setProgress(100);
      storage.remove(REGISTER_DRAFT_KEY);
      setStatus('success');
      // Delay redirect slightly so the success overlay is noticeable
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
      if (status === 409) {
        setGlobalError(
          <LocalizedSection
            zhContent={
              <>
                {textsZh.emailTakenPrefix}
                <a href={LOGIN_PAGE_PATH}>{textsZh.loginNow}</a>
              </>
            }
            enContent={
              <>
                {textsEn.emailTakenPrefix}
                <a href={LOGIN_PAGE_PATH}>{textsEn.loginNow}</a>
              </>
            }
          />
        );
      } else {
        const authTexts = AUTH_ERROR_CONTENT[langKey] || {};
        const key = (status ?? code ?? 'default').toString();
        const localized =
          authTexts[key as keyof typeof authTexts] ||
          authTexts.default ||
          message ||
          activeTexts.errors?.default ||
          '注册失败';
        setGlobalError(localized);
      }
    }
  };

  const passwordStrengthClass = strength
    ? `c-password-strength is-${strength}`
    : 'c-password-strength';

  return (
    <>
      <AccountPanel
        titleZh={textsZh.title}
        titleEn={textsEn.title}
        busy={status === 'loading'}
        statusText={status === 'success' ? { zh: textsZh.success, en: textsEn.success } : undefined}
      >
        <AccountForm onSubmit={handleSubmit}>
          {globalError && (
            <div className="c-global-error" role="alert">
              {globalError}
            </div>
          )}
          <div className="c-form-group">
            <label htmlFor="email" className="c-form-label">
              <LocalizedSection zhContent={textsZh.emailLabel} enContent={textsEn.emailLabel} />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`c-form-control ${errors.email ? 'is-invalid' : email ? 'is-valid' : ''}`}
              placeholder={placeholders.email}
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              required
            />
            {errors.email && (
              <div className="c-invalid-feedback" id="email-error">
                {errors.email}
              </div>
            )}
          </div>
          <div className="c-form-group">
            <label htmlFor="username" className="c-form-label">
              <LocalizedSection
                zhContent={textsZh.usernameLabel}
                enContent={textsEn.usernameLabel}
              />
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`c-form-control ${errors.username ? 'is-invalid' : username ? 'is-valid' : ''}`}
              placeholder={placeholders.username}
              value={username}
              onChange={(e) => handleChange('username', e.target.value)}
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              required
            />
            {errors.username && (
              <div className="c-invalid-feedback" id="username-error">
                {errors.username}
              </div>
            )}
          </div>
          <div className="c-account-passwords">
            <div className="c-password-wrapper">
              <label htmlFor="password" className="c-form-label">
                <LocalizedSection
                  zhContent={textsZh.passwordLabel}
                  enContent={textsEn.passwordLabel}
                />
              </label>
              <div className="c-password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="c-form-control"
                  placeholder={placeholders.password}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'password-hint password-error' : 'password-hint'
                  }
                  required
                />
                <button
                  type="button"
                  className="c-password-toggle"
                  onClick={togglePassword}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      togglePassword();
                    }
                  }}
                  aria-label={
                    showPassword ? activeTexts.passwordToggle.hide : activeTexts.passwordToggle.show
                  }
                  aria-pressed={showPassword}
                >
                  <AccountPasswordIcon shown={showPassword} />
                </button>
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
              {errors.password && (
                <div className="c-invalid-feedback" id="password-error">
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm" className="c-form-label">
                <LocalizedSection
                  zhContent={textsZh.confirmLabel}
                  enContent={textsEn.confirmLabel}
                />
              </label>
              <input
                id="confirm"
                name="confirm"
                type={showPassword ? 'text' : 'password'}
                className={`c-form-control ${confirmError ? 'is-invalid' : confirm ? 'is-valid' : ''}`}
                placeholder={placeholders.confirm}
                value={confirm}
                onChange={(e) => handleChange('confirm', e.target.value)}
                autoComplete="new-password"
                aria-invalid={Boolean(confirmError)}
                aria-describedby={confirmError ? 'confirm-error' : undefined}
                required
              />
              {confirmError && (
                <div className="c-invalid-feedback" id="confirm-error">
                  {confirmError}
                </div>
              )}
            </div>
          </div>
          <div className="c-form-text" id="password-hint">
            <LocalizedSection zhContent={textsZh.passwordHint} enContent={textsEn.passwordHint} />
          </div>
          <div className="c-form-check c-form-check--spaced">
            <input
              id="agree"
              className="c-form-check-input"
              type="checkbox"
              checked={agree}
              onChange={(e) => handleChange('agree', e.target.checked)}
              aria-invalid={Boolean(errors.agree)}
              aria-describedby={errors.agree ? 'agree-error' : undefined}
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
          {errors.agree && (
            <div className="c-invalid-feedback" id="agree-error">
              {errors.agree}
            </div>
          )}
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
          <div className="c-form-alt">
            <a href={LOGIN_PAGE_PATH}>
              <LocalizedSection zhContent={textsZh.loginNow} enContent={textsEn.loginNow} />
            </a>
          </div>
        </AccountForm>
      </AccountPanel>
      {/* Overlay masks the screen during registration or before redirect */}
      <AuthOverlay active={status === 'loading' || status === 'success'} />
    </>
  );
}
