import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { HOME_PAGE_PATH, REGISTER_PAGE_PATH, LOADING_TEXT, AUTH_TIMINGS } from '../../../constants';
import { useLanguage } from '../../providers';
import { LOGIN_CONTENT } from '../../../content';
import { LocalizedSection } from '../../ui';
import { useFormValidation } from '../../../hooks';
import * as Sentry from '@sentry/react';
import { isProduction, getCdnUrl } from '../../../utils/env';
interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type PasswordStrength = '' | 'weak' | 'medium' | 'strong';

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
      email: (val: unknown) => {
        const value = val as string;
        if (!value) return activeTexts.errors?.emailRequired || '邮箱不能为空';
        if (!value.includes('@')) return activeTexts.errors?.emailInvalid || '邮箱格式错误';
        return '';
      },
      password: (val: unknown) => {
        const value = val as string;
        if (!value) return activeTexts.errors?.passwordRequired || '密码不能为空';
        return '';
      }
    }
  );
  const { email, password } = values;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string>('');
  const [strength, setStrength] = useState<PasswordStrength>('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [placeholders, setPlaceholders] = useState<LoginPlaceholders>({
    email: '',
    password: ''
  });

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
  }, [password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      setStatus('loading');
      // fake async login
      await new Promise((res) => setTimeout(res, AUTH_TIMINGS.LOGIN_REQUEST));
      setStatus('success');
      setTimeout(() => {
        window.location.href = HOME_PAGE_PATH + '/';
      }, AUTH_TIMINGS.LOGIN_REDIRECT);
    } catch {
      setGlobalError(activeTexts.errors?.credentials || '账号或密码错误');
      setStatus('error');
    }
  };

  const passwordStrengthClass = strength ? `password-strength ${strength}` : 'password-strength';

  return (
    <form onSubmit={handleSubmit} className="login-container">
      <h1 className="login-title">
        <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
      </h1>
      {globalError && <div className="global-error">{globalError}</div>}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          <LocalizedSection zhContent={textsZh.emailLabel} enContent={textsEn.emailLabel} />
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          placeholder={placeholders.email}
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          autoFocus
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="mb-3 password-wrapper">
        <label htmlFor="password" className="form-label">
          <LocalizedSection zhContent={textsZh.passwordLabel} enContent={textsEn.passwordLabel} />
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          placeholder={placeholders.password}
          value={password}
          onChange={(e) => handleChange('password', e.target.value)}
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
            <LocalizedSection
              zhContent={textsZh.strength[strength as 'weak' | 'medium' | 'strong']}
              enContent={textsEn.strength[strength as 'weak' | 'medium' | 'strong']}
            />
          </div>
        )}
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
            <LocalizedSection zhContent={textsZh.remember} enContent={textsEn.remember} />
          </label>
        </div>
        <a href="/reset" className="small">
          <LocalizedSection zhContent={textsZh.forgot} enContent={textsEn.forgot} />
        </a>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
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
      <div className="third-party">
        <button
          type="button"
          aria-label={activeTexts.thirdParty.google}
          onClick={() => {
            // TODO: Remove below and implement the function
            console.log('Testing Sentry with login button');
            Sentry.captureException(new Error('Test Error from login button'));
            console.log('LoginForm env isProduction: ' + isProduction());
            console.log('LoginForm env getCdnUrl: ' + getCdnUrl('/Test'));
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
      <div className="text-center mt-3">
        <LocalizedSection zhContent={textsZh.newUser} enContent={textsEn.newUser} />{' '}
        <a href={REGISTER_PAGE_PATH}>
          <LocalizedSection zhContent={textsZh.registerNow} enContent={textsEn.registerNow} />
        </a>
      </div>
    </form>
  );
}
