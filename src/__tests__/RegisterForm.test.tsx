import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from '../components/forms/RegisterForm/RegisterForm';

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

import { apiClient } from '../services';

describe('RegisterForm password validation', () => {
  it('shows weak label and prevents submission for weak password', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Username/), {
      target: { value: 'user' }
    });
    fireEvent.change(screen.getByLabelText('Password', { selector: '#password', exact: false }), {
      target: { value: 'abc123' }
    });
    fireEvent.change(screen.getByLabelText('Confirm Password', { exact: false }), {
      target: { value: 'abc123' }
    });
    fireEvent.click(screen.getByRole('checkbox'));
    const submitButton = screen.getByRole('button', { name: /Register/, exact: false });
    fireEvent.click(submitButton);

    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
    expect(apiClient.auth.register).not.toHaveBeenCalled();
    const strength = await screen.findByText('Weak');
    expect(strength).toBeTruthy();
  });
});
