import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

vi.mock('../services', () => ({
  apiClient: {
    auth: {
      register: vi.fn()
    }
  }
}));

import RegisterForm from '../components/forms/RegisterForm/RegisterForm';
import { apiClient } from '../services';

beforeEach(() => {
  vi.mocked(apiClient.auth.register).mockClear();
});

describe('RegisterForm password validation', () => {
  it('updates confirmation feedback when the original password changes', () => {
    render(<RegisterForm />);
    const password = screen.getByLabelText(/Password/, { selector: '#password' });
    const confirmation = screen.getByLabelText(/Confirm Password/);
    fireEvent.change(password, { target: { value: 'Example1' } });
    fireEvent.change(confirmation, { target: { value: 'Example2' } });
    const mismatch = screen.getByText('Passwords do not match');
    expect(confirmation.getAttribute('aria-invalid')).toBe('true');
    expect(confirmation.getAttribute('aria-describedby')).toBe(mismatch.id);

    fireEvent.change(password, { target: { value: 'Example2' } });
    expect(confirmation.getAttribute('aria-invalid')).toBe('false');
    expect(confirmation.hasAttribute('aria-describedby')).toBe(false);
  });

  it('shows weak label and prevents submission for weak password', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Username/), {
      target: { value: 'user' }
    });
    fireEvent.change(screen.getByLabelText(/Password/, { selector: '#password' }), {
      target: { value: 'abc123' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'abc123' }
    });
    fireEvent.click(screen.getByRole('checkbox'));
    const submitButton = screen.getByRole('button', { name: /Register/ });
    fireEvent.click(submitButton);

    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
    expect(apiClient.auth.register).not.toHaveBeenCalled();
    const strength = await screen.findByText('Weak');
    expect(strength).toBeTruthy();
  });
});

describe('RegisterForm data normalization', () => {
  it('normalizes email and username before submission', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'Test@Example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Username/), {
      target: { value: '  user  ' }
    });
    fireEvent.change(screen.getByLabelText(/Password/, { selector: '#password' }), {
      target: { value: 'Abcdef12!' }
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/), {
      target: { value: 'Abcdef12!' }
    });
    fireEvent.click(screen.getByRole('checkbox'));
    const form = document.querySelector('form');
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() =>
      expect(apiClient.auth.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Abcdef12!',
        display_name: 'user'
      })
    );
  });
});
