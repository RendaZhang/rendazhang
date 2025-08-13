import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

vi.mock('../services', () => ({
  apiClient: {
    auth: {
      passwordReset: vi.fn()
    }
  }
}));

import ResetPasswordForm from '../components/forms/ResetPasswordForm/ResetPasswordForm';
import { apiClient } from '../services';

function setToken(token?: string) {
  const url = token
    ? `http://localhost/reset_password?token=${token}`
    : 'http://localhost/reset_password';
  // jsdom does not allow navigation, so redefine location instead
  Object.defineProperty(window, 'location', {
    value: new URL(url),
    writable: true
  });
}

beforeEach(() => {
  vi.mocked(apiClient.auth.passwordReset).mockReset();
});

describe('ResetPasswordForm', () => {
  it('shows invalid link when token is missing', async () => {
    setToken();
    render(<ResetPasswordForm />);
    const msg = await screen.findByText('Invalid or expired link');
    expect(msg).toBeTruthy();
  });

  it('prevents submission for weak password', async () => {
    setToken('abc');
    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/New Password/), {
      target: { value: 'abc' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'abc' }
    });
    const button = await screen.findByRole('button', { name: /Reset Password/ });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(apiClient.auth.passwordReset).not.toHaveBeenCalled();
  });

  it('submits new password and shows success message', async () => {
    setToken('abc');
    vi.mocked(apiClient.auth.passwordReset).mockResolvedValue({ ok: true });
    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/New Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/ }));
    const success = await screen.findByText(
      'Password has been reset. Please log in with your new password.'
    );
    expect(success).toBeTruthy();
    expect(apiClient.auth.passwordReset).toHaveBeenCalledWith({
      token: 'abc',
      password: 'Abcd1234!'
    });
  });

  it('shows resend button on token error', async () => {
    setToken('abc');
    vi.mocked(apiClient.auth.passwordReset).mockRejectedValue({
      error: 'Token invalid or expired'
    });
    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/New Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/ }));
    const resendBtn = await screen.findByRole('link', { name: /Resend email/ });
    expect(resendBtn).toBeTruthy();
  });

  it('shows network error message', async () => {
    setToken('abc');
    vi.mocked(apiClient.auth.passwordReset).mockRejectedValue({
      message: 'Network',
      error: 'network'
    });
    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/New Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'Abcd1234!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/ }));
    const errorMsg = await screen.findByText('Network error, please try again later');
    expect(errorMsg).toBeTruthy();
  });
});
