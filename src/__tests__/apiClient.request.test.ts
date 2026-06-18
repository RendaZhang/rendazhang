import { afterEach, describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));
import apiClient from '../services/apiClient';

describe('apiClient request', () => {
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

  it('forces credentials to include', async () => {
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
  });

  it('removes Content-Type from GET requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({})
    }) as unknown as typeof fetch;
    global.fetch = fetchMock;

    await apiClient.request('https://example.com', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({
        headers: { accept: 'application/json' }
      })
    );
  });

  it('supports custom HTTP and unauthorized error messages', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' } as Location
    });
    global.fetch = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
      json: vi.fn().mockResolvedValue({})
    }) as unknown as typeof fetch;

    await expect(
      apiClient.request('https://example.com/private', {
        unauthorizedMessage: 'Unauthorized'
      })
    ).rejects.toMatchObject({ message: 'Unauthorized', status: 401 });
    expect(window.location.href).toBe('/login');

    global.fetch = vi.fn().mockResolvedValue({
      status: 503,
      ok: false,
      json: vi.fn().mockResolvedValue({})
    }) as unknown as typeof fetch;

    await expect(
      apiClient.request('https://example.com/reset', {
        failureMessage: (response) => `Reset failed: ${response.status}`
      })
    ).rejects.toMatchObject({ message: 'Reset failed: 503', status: 503 });
  });

  it('marks network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(apiClient.request('https://example.com')).rejects.toMatchObject({
      message: 'offline',
      error: 'network'
    });
  });

  it('streams decoded lines and forwards abort signals', async () => {
    const encoder = new TextEncoder();
    const signal = new AbortController().signal;
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('{"text":"Hel'));
        controller.enqueue(encoder.encode('lo"}\n{"text":"world"}'));
        controller.close();
      }
    });
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      body: stream
    }) as unknown as typeof fetch;
    global.fetch = fetchMock;
    const onLine = vi.fn();

    await apiClient.streamLines('https://example.com/stream', {
      method: 'POST',
      body: JSON.stringify({ message: 'hi' }),
      signal,
      onLine
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/stream',
      expect.objectContaining({ credentials: 'include', signal })
    );
    expect(onLine).toHaveBeenNthCalledWith(1, '{"text":"Hello"}');
    expect(onLine).toHaveBeenNthCalledWith(2, '{"text":"world"}');
  });
});
