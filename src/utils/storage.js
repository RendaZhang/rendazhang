// Unified storage utility supporting multiple backends.
// Provides a consistent API for localStorage, sessionStorage, cookies,
// and fallbacks for environments where Web Storage is not available.
// Also exposes asynchronous helpers for IndexedDB operations.
import * as Sentry from '@sentry/react';

const isBrowser = typeof window !== 'undefined';

// Simple in-memory fallback storage
const memoryStore = {};
const memoryStorage = {
  getItem: (key) => (key in memoryStore ? memoryStore[key] : null),
  setItem: (key, value) => {
    memoryStore[key] = value;
  },
  removeItem: (key) => {
    delete memoryStore[key];
  }
};

// Cookie based storage
const cookieStorage = {
  getItem(key) {
    if (!isBrowser) return null;
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + key.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem(key, value, days = 365) {
    if (!isBrowser) return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  removeItem(key) {
    if (!isBrowser) return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
};

function getWebStorage(type = 'local') {
  if (!isBrowser) return null;
  try {
    const storage = type === 'session' ? window.sessionStorage : window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    console.log("storage.js storage getWebStorage type: " + type);
    return storage;
  } catch(e) {
    console.error('storage.js storage getWebStorage failed with type: ' + type);
    Sentry.captureException(e);
    return null;
  }
}

function selectStorage(type = 'local') {
  if (type === 'cookie') return cookieStorage;
  const webStorage = getWebStorage(type);
  return webStorage || memoryStorage;
}

// Basic IndexedDB helpers
async function openDB(dbName = 'appDB', storeName = 'keyval') {
  return new Promise((resolve, reject) => {
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
  async getItem(key, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },
  async setItem(key, value, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },
  async removeItem(key, dbName, storeName) {
    const db = await openDB(dbName, storeName);
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

const storage = {
  get(key, type = 'local') {
    try {
      const store = selectStorage(type);
      const value = store.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('storage.js storage get failed with type ' + type + ' and key ' + key);
      Sentry.captureException(e);
    }
  },
  set(key, value, type = 'local', options = {}) {
    try {
      const store = selectStorage(type);
      if (store === cookieStorage) {
        store.setItem(key, JSON.stringify(value), options.days);
      } else {
        store.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error('storage.js storage set failed with type ' + type + ', key ' + key + ' and value ' + value);
      Sentry.captureException(e);
    }
  },
  remove(key, type = 'local') {
    try {
      const store = selectStorage(type);
      store.removeItem(key);
    } catch (e) {
      console.error('storage.js storage remove failed with type ' + type + ' and key ' + key);
      Sentry.captureException(e);
    }
  },
  // Asynchronous APIs for IndexedDB
  async getIndexedDB(key, dbName, storeName) {
    try {
      const value = await indexedDBStorage.getItem(key, dbName, storeName);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('storage.js IndexedDB get failed with key ' + key + ', dbName ' + dbName + ' and storeName ' + storeName);
      Sentry.captureException(e);
    }
  },
  async setIndexedDB(key, value, dbName, storeName) {
    try {
      await indexedDBStorage.setItem(key, JSON.stringify(value), dbName, storeName);
    } catch (e) {
      console.error('storage.js IndexedDB set failed with key ' + key + ', value ' + value + ', dbName ' + dbName + ' and storeName ' + storeName);
      Sentry.captureException(e);
    }
  },
  async removeIndexedDB(key, dbName, storeName) {
    try {
      await indexedDBStorage.removeItem(key, dbName, storeName);
    } catch (e) {
      console.error('storage.js IndexedDB remove failed with key ' + key + ', dbName ' + dbName + ' and storeName ' + storeName);
      Sentry.captureException(e);
    }
  }
};

export default storage;
export { selectStorage };
