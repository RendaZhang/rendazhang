import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(errorMsg).toBeTruthy();
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
