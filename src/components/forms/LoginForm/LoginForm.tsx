import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  HOME_PAGE_PATH,
  REGISTER_PAGE_PATH,
  LOADING_TEXT,
  AUTH_TIMINGS,
  LOGIN_IDENTIFIER_KEY
} from '../../../constants';
import { apiClient } from '../../../services';
import { useLanguage } from '../../providers';
import { LOGIN_CONTENT, AUTH_ERROR_CONTENT } from '../../../content';
import { LocalizedSection } from '../../ui';
import { useFormValidation, usePasswordStrength } from '../../../hooks';
import { validatePasswordComplexity } from '../../../utils/password';
import { storage } from '../../../utils';
import logger from '../../../utils/logger';
import * as Sentry from '@sentry/react';
import { getEnv, isProduction } from '../../../utils/env';

interface LoginFormValues {
  email: string;
  password: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
interface LoginFormProps {
  texts?: typeof LOGIN_CONTENT;
}

interface LoginPlaceholders {
  email: string;
  password: string;
}

export default function LoginForm({ texts = LOGIN_CONTENT }: LoginFormProps) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = texts.zh || {};
  const textsEn = texts.en || {};
  const activeTexts = texts[langKey] || {};
  const { values, errors, handleChange, validateAll } = useFormValidation<LoginFormValues>(
    { email: '', password: '' },
    {
      email: (value) => {
        if (!value) return activeTexts.errors?.emailRequired || '邮箱不能为空';
        if (!value.includes('@')) return activeTexts.errors?.emailInvalid || '邮箱格式错误';
        return '';
      },
      password: (value) => {
        if (!value) return activeTexts.errors?.passwordRequired || '密码不能为空';
        if (!validatePasswordComplexity(value))
          return (
            activeTexts.errors?.passwordInvalid || '密码至少8位，包含字母、数字或特殊符号中的两种'
          );
        return '';
      }
    }
  );
  const { email, password } = values;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [placeholders, setPlaceholders] = useState<LoginPlaceholders>({
    email: '',
    password: ''
  });

  useEffect(() => {
    const saved = storage.get<string>(LOGIN_IDENTIFIER_KEY);
    if (saved) {
      handleChange('email', saved);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  const strength = usePasswordStrength(password);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      setStatus('loading');
      setGlobalError('');
      await apiClient.auth.login({ identifier: email.trim(), password });
      if (remember) {
        storage.set(LOGIN_IDENTIFIER_KEY, email.trim());
      } else {
        storage.remove(LOGIN_IDENTIFIER_KEY);
      }
      setStatus('success');
      setTimeout(() => {
        window.location.href = HOME_PAGE_PATH;
      }, AUTH_TIMINGS.LOGIN_REDIRECT);
    } catch (err) {
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
      const localized =
        authTexts[key as keyof typeof authTexts] ||
        authTexts.default ||
        message ||
        activeTexts.errors?.credentials ||
        '账号或密码错误';
      setGlobalError(localized);
      setStatus('error');
    }
  };

  const passwordStrengthClass = strength
    ? `c-password-strength is-${strength}`
    : 'c-password-strength';

  return (
    <div className="c-login-container">
      <form onSubmit={handleSubmit} className="c-login-form">
        <h1 className="c-login-title">
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
            className={`c-form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder={placeholders.email}
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            autoFocus
          />
          {errors.email && <div className="c-invalid-feedback">{errors.email}</div>}
        </div>
        <div className="c-form-group c-password-wrapper">
          <label htmlFor="password" className="c-form-label">
            <LocalizedSection zhContent={textsZh.passwordLabel} enContent={textsEn.passwordLabel} />
          </label>
          <div className="c-password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`c-form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder={placeholders.password}
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <span
              className="c-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? activeTexts.passwordToggle.hide : activeTexts.passwordToggle.show
              }
            >
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
          {errors.password && <div className="c-invalid-feedback">{errors.password}</div>}
        </div>
        <div className="c-form-check c-form-group u-d-flex u-justify-content-between">
          <div>
            <input
              id="remember"
              type="checkbox"
              className="c-form-check-input"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="c-form-check-label">
              <LocalizedSection zhContent={textsZh.remember} enContent={textsEn.remember} />
            </label>
          </div>
          <a href="/reset" className="small">
            <LocalizedSection zhContent={textsZh.forgot} enContent={textsEn.forgot} />
          </a>
        </div>
        <button
          type="submit"
          className="c-btn-primary u-w-100 c-form-submit"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
          ) : status === 'success' ? (
            <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
          ) : (
            <LocalizedSection zhContent={textsZh.loginButton} enContent={textsEn.loginButton} />
          )}
        </button>
        <div className="c-third-party">
          <button
            type="button"
            aria-label={activeTexts.thirdParty.google}
            onClick={() => {
              //window.location.href = `${API_BASE_URL}/auth/google`;
              logger.log('LoginForm PUBLIC_CDN_BASE: ' + getEnv('PUBLIC_CDN_BASE'));
              logger.log('LoginForm CDN_BASE: ' + getEnv('CDN_BASE'));
              logger.log('isProduction isProduction: ' + isProduction());
              logger.log(
                'LoginForm import.meta.PUBLIC_CDN_BASE: ' + import.meta.env.PUBLIC_CDN_BASE
              );
              Sentry.captureException(
                new Error(
                  'Sentry Testing in Login Form PUBLIC_TAG_NAME: ' + getEnv('PUBLIC_TAG_NAME')
                )
              );
            }}
          >
            <LocalizedSection
              zhContent={textsZh.thirdParty.google}
              enContent={textsEn.thirdParty.google}
            />
          </button>
          <button type="button" aria-label={activeTexts.thirdParty.github}>
            <LocalizedSection
              zhContent={textsZh.thirdParty.github}
              enContent={textsEn.thirdParty.github}
            />
          </button>
        </div>
        <div className="u-text-center c-form-alt">
          <LocalizedSection zhContent={textsZh.newUser} enContent={textsEn.newUser} />{' '}
          <a href={REGISTER_PAGE_PATH}>
            <LocalizedSection zhContent={textsZh.registerNow} enContent={textsEn.registerNow} />
          </a>
        </div>
      </form>
    </div>
  );
}
