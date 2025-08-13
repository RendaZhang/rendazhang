import { describe, it, expect, vi, afterEach } from 'vitest';
import { sendMessageToAI, resetChat } from '../services/chatService';

describe('chatService unauthorized handling', () => {
  const originalFetch = global.fetch;
  const originalLocation = window.location;

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
    vi.restoreAllMocks();
  });

  it('redirects to login on 401 in sendMessageToAI', async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 401, ok: false }) as unknown as typeof fetch;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' } as Location
    });

    await expect(sendMessageToAI('hi')).rejects.toThrow('Unauthorized');
    expect(window.location.href).toBe('/login');
  });

  it('redirects to login on 401 in resetChat', async () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 401, ok: false }) as unknown as typeof fetch;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' } as Location
    });

    await expect(resetChat()).rejects.toThrow('Unauthorized');
    expect(window.location.href).toBe('/login');
  });
});
