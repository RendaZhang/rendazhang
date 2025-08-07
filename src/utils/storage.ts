// Unified storage utility supporting multiple backends.
// Provides a consistent API for localStorage, sessionStorage, cookies,
// and fallbacks for environments where Web Storage is not available.
// Also exposes asynchronous helpers for IndexedDB operations.
import * as Sentry from '@sentry/react';
import logger from './logger';

const isBrowser: boolean = typeof window !== 'undefined';

interface StorageLike {
  getItem: Storage['getItem'];
  setItem(key: string, value: string, days?: number): void;
  removeItem: Storage['removeItem'];
}

// Simple in-memory fallback storage
const memoryStore: Record<string, string> = {};
const memoryStorage: StorageLike = {
  getItem: (key: string): string | null => (key in memoryStore ? memoryStore[key] : null),
  setItem: (key: string, value: string): void => {
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    delete memoryStore[key];
  }
};

// Cookie based storage
const cookieStorage: StorageLike = {
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + key.replace(/([.$?*|{}()\\[\\]\\\/\\+^])/g, '\\$1') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem(key: string, value: string, days = 365): void {
    if (!isBrowser) return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  removeItem(key: string): void {
    if (!isBrowser) return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

type StorageType = 'local' | 'session' | 'cookie';

function getWebStorage(type: StorageType = 'local'): StorageLike | null {
  if (!isBrowser) return null;
  try {
    const storage: Storage = type === 'session' ? window.sessionStorage : window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    logger.log('storage.ts getWebStorage type: ' + type);
    return storage as StorageLike;
  } catch (e) {
    console.error('storage.ts getWebStorage failed', e);
    Sentry.captureException(e);
    return null;
  }
}

function selectStorage(type: StorageType = 'local'): StorageLike {
  if (type === 'cookie') return cookieStorage;
  const webStorage = getWebStorage(type);
  return webStorage || memoryStorage;
}

// Basic IndexedDB helpers
async function openDB(dbName = 'appDB', storeName = 'keyval'): Promise<IDBDatabase | null> {
  return new Promise<IDBDatabase | null>((resolve, reject) => {
    if (!isBrowser || !('indexedDB' in window)) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const indexedDBStorage = {
  async getItem(key: string, dbName = 'appDB', storeName = 'keyval'): Promise<string | null> {
    const db = await openDB(dbName, storeName);
    if (!db) return null;
    return new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  },
  async setItem(key: string, value: string, dbName = 'appDB', storeName = 'keyval'): Promise<void> {
    const db = await openDB(dbName, storeName);
    if (!db) return;
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async removeItem(key: string, dbName = 'appDB', storeName = 'keyval'): Promise<void> {
    const db = await openDB(dbName, storeName);
    if (!db) return;
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

const storage = {
  get<T = unknown>(key: string, type: StorageType = 'local'): T | string | null {
    try {
      const store = selectStorage(type);
      const value = store.getItem(key);
      if (value === null) return null;
      try {
        // 尝试解析 JSON，成功则返回解析结果
        return JSON.parse(value) as T;
      } catch {
        // 解析失败说明是旧版字符串，直接返回原始值
        return value;
      }
    } catch (e) {
      console.error('storage.ts get failed', e);
      Sentry.captureException(e);
      return null;
    }
  },
  set<T>(
    key: string,
    value: T,
    type: StorageType = 'local',
    options: { days?: number } = {}
  ): void {
    try {
      const store = selectStorage(type);
      const stringValue = JSON.stringify(value);
      if (store === cookieStorage) {
        store.setItem(key, stringValue, options.days);
      } else {
        store.setItem(key, stringValue);
      }
    } catch (e) {
      console.error('storage.ts set failed', e);
      Sentry.captureException(e);
    }
  },
  remove(key: string, type: StorageType = 'local'): void {
    try {
      const store = selectStorage(type);
      store.removeItem(key);
    } catch (e) {
      console.error('storage.ts remove failed', e);
      Sentry.captureException(e);
    }
  },
  // Asynchronous APIs for IndexedDB
  async getIndexedDB<T = unknown>(
    key: string,
    dbName = 'appDB',
    storeName = 'keyval'
  ): Promise<T | string | null> {
    try {
      const value = await indexedDBStorage.getItem(key, dbName, storeName);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        // 解析失败说明是旧版字符串，直接返回原始值
        return value;
      }
    } catch (e) {
      console.error('storage.ts IndexedDB get failed', e);
      Sentry.captureException(e);
      return null;
    }
  },
  async setIndexedDB<T>(
    key: string,
    value: T,
    dbName = 'appDB',
    storeName = 'keyval'
  ): Promise<void> {
    try {
      await indexedDBStorage.setItem(key, JSON.stringify(value), dbName, storeName);
    } catch (e) {
      console.error('storage.ts IndexedDB set failed', e);
      Sentry.captureException(e);
    }
  },
  async removeIndexedDB(key: string, dbName = 'appDB', storeName = 'keyval'): Promise<void> {
    try {
      await indexedDBStorage.removeItem(key, dbName, storeName);
    } catch (e) {
      console.error('storage.ts IndexedDB remove failed', e);
      Sentry.captureException(e);
    }
  }
};

export default storage;
export { selectStorage };
