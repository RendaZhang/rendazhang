import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));

import * as Sentry from '@sentry/react';
import storage from '../utils/storage';
import logger from '../utils/logger';

// cast through unknown so TypeScript allows accessing mocked captureException
const sentryMock = Sentry as unknown as {
  captureException: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.restoreAllMocks();
  // reapply Sentry mock after restoreAllMocks
  sentryMock.captureException = vi.fn();
});

describe('storage utility', () => {
  it('handles JSON parse, string fallback and remove in localStorage', () => {
    storage.set('obj', { a: 1 });
    expect(storage.get<{ a: number }>('obj')).toEqual({ a: 1 });

    window.localStorage.setItem('plain', 'hello');
    expect(storage.get('plain')).toBe('hello');

    storage.set('tmp', 'value');
    storage.remove('tmp');
    expect(window.localStorage.getItem('tmp')).toBeNull();
  });

  it('respects cookie expiration parameter', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01'));
    const spy = vi.spyOn(document, 'cookie', 'set');
    storage.set('cookieKey', 'cookieVal', 'cookie', { days: 2 });
    const expected = new Date('2020-01-03').toUTCString();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`expires=${expected}`)
    );
    expect(storage.get('cookieKey', 'cookie')).toBe('cookieVal');
    storage.remove('cookieKey', 'cookie');
    spy.mockRestore();
    vi.useRealTimers();
  });

  it('falls back to memory storage when localStorage is unavailable', () => {
    const original = window.localStorage;
    // make localStorage unavailable
    Object.defineProperty(window, 'localStorage', { configurable: true, value: undefined });
    const loggerSpy = vi.spyOn(logger, 'error');
    storage.set('mem', { b: 2 });
    expect(storage.get<{ b: number }>('mem')).toEqual({ b: 2 });
    storage.remove('mem');
    expect(storage.get('mem')).toBeNull();
    expect(loggerSpy).toHaveBeenCalled();
    expect(sentryMock.captureException).toHaveBeenCalled();
    Object.defineProperty(window, 'localStorage', { configurable: true, value: original });
  });

  it('logs and captures errors when operations throw', () => {
    const original = window.localStorage;
    const faulty: Storage = {
      getItem: () => {
        throw new Error('get err');
      },
      setItem: (key: string, value: string) => {
        if (key === '__storage_test__') return;
        throw new Error('set err');
      },
      removeItem: (key: string) => {
        if (key === '__storage_test__') return;
        throw new Error('remove err');
      },
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    };
    Object.defineProperty(window, 'localStorage', { configurable: true, value: faulty });
    const loggerSpy = vi.spyOn(logger, 'error');

    expect(storage.get('x')).toBeNull();
    storage.set('x', 'y');
    storage.remove('x');

    expect(loggerSpy).toHaveBeenCalledTimes(3);
    expect(sentryMock.captureException).toHaveBeenCalledTimes(3);

    Object.defineProperty(window, 'localStorage', { configurable: true, value: original });
  });
});
