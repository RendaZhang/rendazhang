import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../components/forms/LoginForm/LoginForm';

vi.mock('../components/providers', () => ({
  useLanguage: () => ({ lang: 'en' })
}));

// Mock services to avoid network calls
vi.mock('../services', () => ({
  apiClient: {
    auth: {
      login: vi.fn()
    }
  }
}));

describe('Password toggle accessibility', () => {
  it('toggles visibility and aria-pressed via keyboard', () => {
    render(<LoginForm />);
    const toggle = screen.getByRole('button', { name: /show password/i });
    const input = screen.getByLabelText(/password/i, { selector: 'input' });

    expect(input.getAttribute('type')).toBe('password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(toggle);
    expect(input.getAttribute('type')).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    fireEvent.keyDown(toggle, { key: 'Enter', code: 'Enter' });
    expect(input.getAttribute('type')).toBe('password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });
});
