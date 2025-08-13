import { describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));
import apiClient from '../services/apiClient';

describe('apiClient request', () => {
  it('forces credentials to include', async () => {
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    }) as unknown as typeof fetch;
    global.fetch = fetchMock;

    await apiClient.request('https://example.com', {
      credentials: 'omit'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ credentials: 'include' })
    );

    global.fetch = originalFetch;
  });
});
