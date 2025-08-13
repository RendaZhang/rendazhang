import { describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));
import * as Sentry from '@sentry/react';
import apiClient from '../services/apiClient';

describe('apiClient request', () => {
  it('strips sensitive data before reporting to Sentry', async () => {
    const bodyContent = JSON.stringify({ secret: 'value' });
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: 'server error' })
    }) as unknown as typeof fetch;

    await expect(
      apiClient.request('https://example.com', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer secret',
          'Content-Type': 'application/json'
        },
        body: bodyContent
      })
    ).rejects.toThrow();

    const captureSpy = Sentry.captureException as unknown as ReturnType<typeof vi.fn>;
    expect(captureSpy).toHaveBeenCalled();
    const extra = captureSpy.mock.calls[0][1]?.extra as {
      options: { body?: unknown; headers: Record<string, unknown> };
    };
    expect(extra?.options.body).toBeUndefined();
    expect(extra?.options.headers.Authorization).toBeUndefined();
    expect(JSON.stringify(extra)).not.toContain(bodyContent);

    captureSpy.mockReset();
    global.fetch = originalFetch;
  });

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

  it('omits Content-Type for GET requests', async () => {
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    }) as unknown as typeof fetch;
    global.fetch = fetchMock;

    await apiClient.request('https://example.com', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Test': '1'
      }
    });

    const fetchOptions = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = fetchOptions.headers as Record<string, string>;
    expect(headers).not.toHaveProperty('content-type');
    expect(headers['x-test']).toBe('1');

    global.fetch = originalFetch;
  });
});
