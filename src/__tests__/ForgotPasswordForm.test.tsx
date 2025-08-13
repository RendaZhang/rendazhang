import { render, screen, fireEvent } from '@testing-library/react';
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
});
