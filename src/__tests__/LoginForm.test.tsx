import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../components/forms/LoginForm/LoginForm';

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

vi.mock('../services', () => ({
  apiClient: {
    auth: {
      login: vi.fn()
    }
  }
}));

import { apiClient } from '../services';

describe('LoginForm error handling', () => {
  it('focuses the first invalid field and associates the visible error with it', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /Login$/ }));

    const email = screen.getByLabelText(/Email or Username/);
    const error = screen.getByText('Email is required');
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.getAttribute('aria-describedby')).toBe(error.id);
    await waitFor(() => expect(document.activeElement).toBe(email));
  });

  it('shows credential error message', async () => {
    vi.mocked(apiClient.auth.login).mockRejectedValue({
      message: 'Unauthorized',
      status: 401
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Email or Username/), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: 'Abcdef12!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Login$/ }));
    const errorMsg = await screen.findByText('Incorrect username or password');
    expect(errorMsg).toBe(screen.getByRole('alert'));
  });

  it('shows network error message', async () => {
    vi.mocked(apiClient.auth.login).mockRejectedValue({
      message: 'Network',
      error: 'network'
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Email or Username/), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: 'Abcdef12!' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Login$/ }));
    const errorMsg = await screen.findByText('Network error, please try again later');
    expect(errorMsg).toBeTruthy();
  });
});
