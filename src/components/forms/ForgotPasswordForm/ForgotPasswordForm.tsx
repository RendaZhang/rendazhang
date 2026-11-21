import { useState } from 'react';
import type { FormEvent } from 'react';
import { LOGIN_PAGE_PATH, LOADING_TEXT } from '../../../constants';
import { useLanguage } from '../../providers';
import { LocalizedSection, AuthOverlay } from '../../ui';
import { useFormValidation } from '../../../hooks';
import { apiClient } from '../../../services';
import AccountPanel, { focusFirstAccountError } from '../AccountPanel';
import AccountForm from '../AccountForm';

interface ForgotFormValues {
  email: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const TEXTS = {
  zh: {
    title: '忘记密码',
    emailLabel: '邮箱',
    submitButton: '发送重置邮件',
    successTitle: '请查收邮件',
    success: '如果该邮箱已注册，重置邮件已发送。链接在 15 分钟内有效。',
    back: '返回登录',
    errors: {
      emailRequired: '邮箱不能为空',
      emailInvalid: '邮箱格式不正确',
      network: '网络错误，请稍后重试',
      default: '发送失败'
    }
  },
  en: {
    title: 'Forgot password',
    emailLabel: 'Email',
    submitButton: 'Send reset email',
    successTitle: 'Check your email',
    success: 'If this email is registered, check for a reset link. It expires in 15 minutes.',
    back: 'Back to login',
    errors: {
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email format',
      network: 'Network error, please try again later',
      default: 'Request failed'
    }
  }
} as const;

export default function ForgotPasswordForm() {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  const textsZh = TEXTS.zh;
  const textsEn = TEXTS.en;
  const texts = TEXTS[langKey];

  const { values, errors, handleChange, validateAll } = useFormValidation<ForgotFormValues>(
    { email: '' },
    {
      email: (value) => {
        if (!value) return texts.errors.emailRequired;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return texts.errors.emailInvalid;
        return '';
      }
    }
  );

  const { email } = values;
  const [status, setStatus] = useState<FormStatus>('idle');
  const [globalError, setGlobalError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (status === 'loading') return;
    if (!validateAll()) {
      focusFirstAccountError(e.currentTarget);
      return;
    }
    try {
      setStatus('loading');
      setGlobalError('');
      const normalizedEmail = email.trim().toLowerCase();
      await apiClient.auth.passwordForgot({ identifier: normalizedEmail });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      const { error: apiError } = err as { error?: string };
      if (apiError === 'network') {
        setGlobalError(texts.errors.network);
      } else {
        setGlobalError(texts.errors.default);
      }
    }
  };

  if (status === 'success') {
    return (
      <AccountPanel titleZh={textsZh.successTitle} titleEn={textsEn.successTitle} focusTitle>
        <div className="c-reset-success">
          <p>
            <LocalizedSection zhContent={textsZh.success} enContent={textsEn.success} />
          </p>
          <a className="c-btn-primary" href={LOGIN_PAGE_PATH}>
            <LocalizedSection zhContent={textsZh.back} enContent={textsEn.back} />
          </a>
        </div>
      </AccountPanel>
    );
  }

  return (
    <>
      <AccountPanel titleZh={textsZh.title} titleEn={textsEn.title} busy={status === 'loading'}>
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
              autoComplete="email"
              className={`c-form-control ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <div className="c-invalid-feedback" id="email-error">
                {errors.email}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="c-btn-primary u-w-100 c-form-submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <LocalizedSection zhContent={LOADING_TEXT.ZH} enContent={LOADING_TEXT.EN} />
            ) : (
              <LocalizedSection zhContent={textsZh.submitButton} enContent={textsEn.submitButton} />
            )}
          </button>
          <div className="c-form-alt">
            <a href={LOGIN_PAGE_PATH}>
              <LocalizedSection zhContent={textsZh.back} enContent={textsEn.back} />
            </a>
          </div>
        </AccountForm>
      </AccountPanel>
      {/* Overlay covers the page while the email request is processing */}
      <AuthOverlay active={status === 'loading'} />
    </>
  );
}
