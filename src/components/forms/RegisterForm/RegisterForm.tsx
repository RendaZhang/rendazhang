import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  LOGIN_PAGE_PATH,
  LOADING_TEXT,
  AUTH_TIMINGS,
  REGISTER_DRAFT_KEY
} from '../../../constants';
import { useLanguage } from '../../providers';
import { REGISTER_CONTENT } from '../../../content';
import { LocalizedSection } from '../../ui';
import { useFormValidation } from '../../../hooks';
import { storage } from '../../../utils';

interface RegisterFormValues extends Record<string, unknown> {
  email: string;
  username: string;
  password: string;
  confirm: string;
  agree: boolean;
}

type FormStatus = 'idle' | 'loading' | 'success';
type PasswordStrength = '' | 'weak' | 'medium' | 'strong';

interface RegisterFormProps {
  texts?: any;
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
  const [strength, setStrength] = useState<PasswordStrength>('');
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [placeholders, setPlaceholders] = useState<RegisterPlaceholders>({
    email: '',
    username: '',
    password: '',
    confirm: ''
  });

  const { values, errors, handleChange, validateAll } = useFormValidation<RegisterFormValues>(
    { email: '', username: '', password: '', confirm: '', agree: false },
    {
      email: (val: unknown) => {
        const value = val as string;
        if (!value) return activeTexts.errors?.emailRequired || '邮箱不能为空';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return activeTexts.errors?.emailInvalid || '邮箱格式错误';
        }
        return '';
      },
      username: (val: unknown) =>
        !(val as string) ? activeTexts.errors?.usernameRequired || '用户名不能为空' : '',
      password: (val: unknown) =>
        !(val as string) ? activeTexts.errors?.passwordRequired || '密码不能为空' : '',
      confirm: (val: unknown, all: RegisterFormValues) =>
        (val as string) !== all.password
          ? activeTexts.errors?.passwordMismatch || '两次密码不一致'
          : '',
      agree: (val: unknown) =>
        !(val as boolean) ? activeTexts.errors?.agreement || '请勾选同意' : ''
    }
  );
  const { email, username, password, confirm, agree } = values;

  useEffect(() => {
    const saved = storage.get(REGISTER_DRAFT_KEY) as
      | Partial<RegisterFormValues>
      | null;
    if (saved) {
      handleChange('email', saved.email || '');
      handleChange('username', saved.username || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ph = (texts[langKey] && texts[langKey].placeholders) || {};
    setPlaceholders(ph);
  }, [langKey, texts]);

  useEffect(() => {
    storage.set(REGISTER_DRAFT_KEY, { email, username });
  }, [email, username]);

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

  const canSubmit: boolean =
    Boolean(email && username && password && confirm && agree) &&
    Object.keys(errors).length === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateAll()) return;
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
          className={`form-control ${errors.email ? 'is-invalid' : email ? 'is-valid' : ''}`}
          placeholder={placeholders.email}
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          <LocalizedSection zhContent={textsZh.usernameLabel} enContent={textsEn.usernameLabel} />
        </label>
        <input
          id="username"
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : username ? 'is-valid' : ''}`}
          placeholder={placeholders.username}
          value={username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
        />
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        {!errors.username && username && (
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
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
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
        </div>
        <div className="grid-col-sm-6">
          <label htmlFor="confirm" className="form-label">
            <LocalizedSection zhContent={textsZh.confirmLabel} enContent={textsEn.confirmLabel} />
          </label>
          <input
            id="confirm"
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.confirm ? 'is-invalid' : confirm ? 'is-valid' : ''}`}
            placeholder={placeholders.confirm}
            value={confirm}
            onChange={(e) => handleChange('confirm', e.target.value)}
            required
          />
          {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
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
          onChange={(e) => handleChange('agree', e.target.checked as boolean)}
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
