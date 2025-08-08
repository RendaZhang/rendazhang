import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));
vi.mock('../utils/storage', () => ({ default: { get: vi.fn() } }));
vi.mock('../utils/logger', () => ({ default: { log: vi.fn(), error: vi.fn() } }));

import * as Sentry from '@sentry/react';
import storage from '../utils/storage';
import logger from '../utils/logger';
import { LANG_STORAGE_KEY } from '../constants/settings';
import { getCurrentLang } from '../utils/langUtils';

const storageMock = storage as unknown as { get: ReturnType<typeof vi.fn> };
const loggerMock = logger as unknown as {
  log: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
};
const sentryMock = Sentry as unknown as { captureException: ReturnType<typeof vi.fn> };

beforeEach(() => {
  vi.restoreAllMocks();
  storageMock.get = vi.fn();
  loggerMock.log = vi.fn();
  loggerMock.error = vi.fn();
  sentryMock.captureException = vi.fn();
  document.documentElement.lang = '';
});

describe('getCurrentLang', () => {
  it('returns document.documentElement.lang when set', () => {
    document.documentElement.lang = 'en-US';
    storageMock.get.mockReturnValue('fr-FR');

    expect(getCurrentLang()).toBe('en-US');
    expect(storageMock.get).not.toHaveBeenCalled();
  });

  it('uses stored language when document lang missing', () => {
    storageMock.get.mockReturnValue('ja-JP');
    const lang = getCurrentLang();
    expect(lang).toBe('ja-JP');
    expect(storageMock.get).toHaveBeenCalledWith(LANG_STORAGE_KEY);
    expect(loggerMock.log).toHaveBeenCalledWith('langUtils getCurrentLang storedLang: ja-JP');
  });

  it('falls back to default when storage has no value', () => {
    storageMock.get.mockReturnValue(null);
    const lang = getCurrentLang();
    expect(lang).toBe('zh-CN');
    expect(loggerMock.log).toHaveBeenCalledWith('langUtils getCurrentLang storedLang: null');
  });

  it('logs and captures errors when storage access fails', () => {
    const err = new Error('boom');
    storageMock.get.mockImplementation(() => {
      throw err;
    });
    const lang = getCurrentLang();
    expect(lang).toBe('zh-CN');
    expect(loggerMock.error).toHaveBeenCalledWith('读取语言存储失败', err);
    expect(sentryMock.captureException).toHaveBeenCalledWith(err);
    expect(loggerMock.log).not.toHaveBeenCalled();
  });
});
