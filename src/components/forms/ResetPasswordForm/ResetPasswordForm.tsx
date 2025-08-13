import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { LOGIN_PAGE_PATH, LOADING_TEXT, FORGOT_PASSWORD_PAGE_PATH } from '../../../constants';
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
    success: '密码已重置，请使用新密码登录。',
    resend: '重新发送邮件',
    login: '前往登录',
    lengthHint: '长度',
    classHint: '字符种类',
    errors: {
      passwordRequired: '密码不能为空',
      passwordInvalid: '密码需8–128位，并包含字母/数字/特殊字符中的至少两类',
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
    success: 'Password has been reset. Please log in with your new password.',
    resend: 'Resend email',
    login: 'Back to login',
    lengthHint: 'Length',
    classHint: 'Character types',
    errors: {
      passwordRequired: 'Password is required',
      passwordInvalid:
        'Password must be 8–128 characters and include at least two of letters, numbers or symbols',
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

  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    setToken(t || '');
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
  const classCount =
    Number(/[A-Za-z]/.test(password)) +
    Number(/\d/.test(password)) +
    Number(/[^A-Za-z0-9]/.test(password));
  const canSubmit = validatePasswordComplexity(password) && password === confirm;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
    try {
      setStatus('loading');
      setGlobalError('');
      await apiClient.auth.passwordReset({ token, password });
      setStatus('success');
    } catch (err) {
      const { error: apiError, message } = err as { error?: string; message?: string };
      if (apiError?.includes('Token')) {
        setGlobalError(activeTexts.errors.tokenMissing);
      } else if (apiError?.includes('weak password')) {
        setGlobalError(activeTexts.errors.passwordInvalid);
      } else {
        setGlobalError(message || activeTexts.errors.default);
      }
      setStatus('error');
    }
  };

  if (token === undefined) return null;

  if (!token) {
    return (
      <div className="c-login-container">
        <div className="c-reset-invalid">
          <p>
            <LocalizedSection
              zhContent={textsZh.errors.tokenMissing}
              enContent={textsEn.errors.tokenMissing}
            />
          </p>
          <a className="c-btn-primary" href={FORGOT_PASSWORD_PAGE_PATH}>
            <LocalizedSection zhContent={textsZh.resend} enContent={textsEn.resend} />
          </a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="c-login-container">
        <div className="c-reset-success">
          <p>
            <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
          </p>
          <a className="c-btn-primary" href={LOGIN_PAGE_PATH}>
            <LocalizedSection zhContent={textsZh.login} enContent={textsEn.login} />
          </a>
        </div>
      </div>
    );
  }

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
        <div className="c-password-hints">
          <div>
            <LocalizedSection
              zhContent={`${textsZh.lengthHint}：${password.length} / 8-128`}
              enContent={`${textsEn.lengthHint}: ${password.length} / 8-128`}
            />
          </div>
          <div>
            <LocalizedSection
              zhContent={`${textsZh.classHint}：${classCount} / ≥2`}
              enContent={`${textsEn.classHint}: ${classCount} / ≥2`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="c-btn-primary u-w-100 c-form-submit"
          disabled={status === 'loading' || status === 'success' || !canSubmit}
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
