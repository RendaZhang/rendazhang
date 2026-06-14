import { describe, it, expect, vi, afterEach } from 'vitest';
import { sendMessageToAI, resetChat } from '../services/chatService';

describe('chatService unauthorized handling', () => {
  const originalFetch = global.fetch;
  const originalLocation = window.location;
  const encoder = new TextEncoder();

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

  it('parses newline-delimited JSON split across stream chunks', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('{"text":"Hel'));
        controller.enqueue(encoder.encode('lo"}\n{"text":" wor'));
        controller.enqueue(encoder.encode('ld"}\n'));
        controller.close();
      }
    });
    const onChunk = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      body: stream
    }) as unknown as typeof fetch;

    await expect(sendMessageToAI('hi', onChunk)).resolves.toBe('Hello world');
    expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello');
    expect(onChunk).toHaveBeenNthCalledWith(2, 'Hello world');
  });
});
