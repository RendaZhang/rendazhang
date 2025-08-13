import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { LOGIN_PAGE_PATH, LOADING_TEXT, AUTH_TIMINGS } from '../../../constants';
import { useLanguage } from '../../providers';
import { LocalizedSection } from '../../ui';
import { useFormValidation, usePasswordStrength } from '../../../hooks';
import { validatePasswordComplexity } from '../../../utils/password';
import { apiClient } from '../../../services';

interface ResetFormValues {
  password: string;
  confirm: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const TEXTS = {
  zh: {
    title: '重置密码',
    passwordLabel: '新密码',
    confirmLabel: '确认密码',
    resetButton: '重置密码',
    success: '密码重置成功',
    errors: {
      passwordRequired: '密码不能为空',
      passwordInvalid: '密码至少8位，包含字母、数字或特殊符号中的两种',
      passwordMismatch: '两次密码不一致',
      tokenMissing: '链接无效或已过期',
      default: '重置失败'
    },
    strength: {
      weak: '弱',
      medium: '中',
      strong: '强'
    },
    passwordToggle: {
      show: '显示密码',
      hide: '隐藏密码'
    }
  },
  en: {
    title: 'Reset Password',
    passwordLabel: 'New Password',
    confirmLabel: 'Confirm Password',
    resetButton: 'Reset Password',
    success: 'Password reset successful',
    errors: {
      passwordRequired: 'Password is required',
      passwordInvalid:
        'Password must be at least 8 characters and include two of letters, numbers or symbols',
      passwordMismatch: 'Passwords do not match',
      tokenMissing: 'Invalid or expired link',
      default: 'Reset failed'
    },
    strength: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    },
    passwordToggle: {
      show: 'Show password',
      hide: 'Hide password'
    }
  }
} as const;

export default function ResetPasswordForm() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = TEXTS.zh;
  const textsEn = TEXTS.en;
  const activeTexts = TEXTS[langKey];

  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
  }, []);

  const { values, errors, handleChange, validateAll } = useFormValidation<ResetFormValues>(
    { password: '', confirm: '' },
    {
      password: (value) => {
        if (!value) return activeTexts.errors.passwordRequired;
        if (!validatePasswordComplexity(value)) {
          return activeTexts.errors.passwordInvalid;
        }
        return '';
      },
      confirm: (value, all) => (value !== all.password ? activeTexts.errors.passwordMismatch : '')
    }
  );

  const { password, confirm } = values;
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = (): void => setShowPassword((v) => !v);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [globalError, setGlobalError] = useState('');
  const strength = usePasswordStrength(password);
  const passwordStrengthClass = strength
    ? `c-password-strength is-${strength}`
    : 'c-password-strength';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!token) {
      setGlobalError(activeTexts.errors.tokenMissing);
      return;
    }
    if (!validateAll()) return;
    try {
      setStatus('loading');
      setGlobalError('');
      await apiClient.auth.passwordReset({ token, password });
      setStatus('success');
      setTimeout(() => {
        window.location.href = LOGIN_PAGE_PATH;
      }, AUTH_TIMINGS.LOGIN_REDIRECT);
    } catch (err) {
      const message = (err as { message?: string }).message || activeTexts.errors.default;
      setGlobalError(message);
      setStatus('error');
    }
  };

  return (
    <div className="c-login-container">
      <form onSubmit={handleSubmit} className="c-login-form">
        <h1 className="c-login-title">
          <LocalizedSection zhContent={textsZh.title} enContent={textsEn.title} />
        </h1>
        {globalError && <div className="c-global-error">{globalError}</div>}
        <div className="c-form-group c-password-wrapper">
          <label htmlFor="password" className="c-form-label">
            <LocalizedSection zhContent={textsZh.passwordLabel} enContent={textsEn.passwordLabel} />
          </label>
          <div className="c-password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`c-form-control ${errors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              autoFocus
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
                showPassword ? activeTexts.passwordToggle?.hide : activeTexts.passwordToggle?.show
              }
              aria-pressed={showPassword}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className={passwordStrengthClass}></div>
          {strength && (
            <div className="c-password-strength-label">
              <LocalizedSection
                zhContent={textsZh.strength?.[strength as 'weak' | 'medium' | 'strong']}
                enContent={textsEn.strength?.[strength as 'weak' | 'medium' | 'strong']}
              />
            </div>
          )}
          {errors.password && <div className="c-invalid-feedback">{errors.password}</div>}
        </div>
        <div className="c-form-group">
          <label htmlFor="confirm" className="c-form-label">
            <LocalizedSection zhContent={textsZh.confirmLabel} enContent={textsEn.confirmLabel} />
          </label>
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            className={`c-form-control ${errors.confirm ? 'is-invalid' : ''}`}
            value={confirm}
            onChange={(e) => handleChange('confirm', e.target.value)}
          />
          {errors.confirm && <div className="c-invalid-feedback">{errors.confirm}</div>}
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
            <LocalizedSection zhContent={textsZh.resetButton} enContent={textsEn.resetButton} />
          )}
        </button>
      </form>
    </div>
  );
}
