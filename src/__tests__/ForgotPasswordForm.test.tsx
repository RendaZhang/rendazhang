import { render, screen, fireEvent, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

vi.mock('../services', () => ({
  apiClient: {
    auth: {
      passwordForgot: vi.fn()
    }
  }
}));

import ForgotPasswordForm from '../components/forms/ForgotPasswordForm/ForgotPasswordForm';
import { apiClient } from '../services';

beforeEach(() => {
  vi.mocked(apiClient.auth.passwordForgot).mockReset();
});

describe('ForgotPasswordForm', () => {
  it('blocks native submission before hydration and enables the same form after hydration', async () => {
    vi.mocked(apiClient.auth.passwordForgot).mockResolvedValue({ ok: true });
    const container = document.createElement('div');
    container.innerHTML = renderToString(<ForgotPasswordForm />);
    document.body.append(container);

    const view = within(container);
    const form = container.querySelector('form')!;
    const email = view.getByLabelText(/Email/);
    const submit = view.getByRole('button', { name: /Send Reset Email/ });
    const nativeSubmit = vi.fn();
    form.addEventListener('submit', nativeSubmit);

    expect(form.method).toBe('post');
    expect(email.matches(':disabled')).toBe(true);
    expect(submit.matches(':disabled')).toBe(true);
    expect(view.getByRole('link', { name: /Back to login/ }).getAttribute('href')).toBe('/login');
    submit.click();
    expect(nativeSubmit).not.toHaveBeenCalled();
    expect(apiClient.auth.passwordForgot).not.toHaveBeenCalled();

    render(<ForgotPasswordForm />, { container, hydrate: true });
    expect(email.matches(':disabled')).toBe(false);
    expect(submit.matches(':disabled')).toBe(false);
    fireEvent.change(email, { target: { value: 'account@example.invalid' } });
    fireEvent.click(submit);
    await view.findByText(/If the email exists/);
    expect(apiClient.auth.passwordForgot).toHaveBeenCalledExactlyOnceWith({
      identifier: 'account@example.invalid'
    });
  });

  it('submits email and shows success message', async () => {
    vi.mocked(apiClient.auth.passwordForgot).mockResolvedValue({ ok: true });
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: '  User@Example.COM  ' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/ }));
    const success = await screen.findByText(/If the email exists, we have sent a reset email/i);
    expect(success).toBeTruthy();
    expect(apiClient.auth.passwordForgot).toHaveBeenCalledWith({
      identifier: 'user@example.com'
    });
  });

  it('shows invalid email error and prevents submission', async () => {
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'bad' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/ }));
    const error = await screen.findByText('Invalid email format');
    expect(error).toBeTruthy();
    expect(apiClient.auth.passwordForgot).not.toHaveBeenCalled();
  });

  it('shows network error message', async () => {
    vi.mocked(apiClient.auth.passwordForgot).mockRejectedValue({
      message: 'Network',
      error: 'network'
    });
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'user@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Email/ }));
    const errorMsg = await screen.findByText('Network error, please try again later');
    expect(errorMsg).toBeTruthy();
  });
});
