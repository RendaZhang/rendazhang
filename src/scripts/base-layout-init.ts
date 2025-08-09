/**
 * BaseLayout initialization entry.
 *
 * This IIFE runs before the page paints to apply stored theme, language
 * and title preferences. The script is authored in TypeScript for
 * maintainability and compiled to `public/js/base-layout-init.js` so it
 * can be loaded as an external blocking script that complies with Nginx
 * Content-Security-Policy rules.
 */
(() => {
  interface BaseLayoutDataset extends DOMStringMap {
    themeKey?: string;
    langKey?: string;
    titleZh?: string;
    titleEn?: string;
    isProd?: string;
  }

  const dataset = (document.currentScript?.dataset || {}) as BaseLayoutDataset;
  const { themeKey = '', langKey = '', titleZh = '', titleEn = '', isProd = 'true' } = dataset;

  const isProduction = isProd === 'true';
  const log = (...args: unknown[]) => {
    if (!isProduction) console.log(...args);
  };

  interface StorageHelper {
    __version: string;
    get: (key: string) => unknown;
    set: (key: string, val: unknown) => void;
  }
  interface WindowWithStorage extends Window {
    __storageInitialized?: boolean;
    __storageHelper: StorageHelper;
  }
  const win = window as WindowWithStorage;

  // Prevent duplicate execution when the script is included multiple times.
  if (win.__storageInitialized) return;
  win.__storageInitialized = true;

  // Lightweight storage helper without importing other modules.
  win.__storageHelper = {
    __version: '1.0',
    get(key: string) {
      try {
        const v = localStorage.getItem(key);
        return v
          ? (() => {
              try {
                return JSON.parse(v);
              } catch {
                return v;
              }
            })()
          : null;
      } catch {
        return null;
      }
    },
    set(key: string, val: unknown) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
        /* ignore */
      }
    }
  };

  // Apply persisted or system theme before paint to avoid flashes.
  const initTheme = () => {
    try {
      const storedTheme = win.__storageHelper.get(themeKey);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
      log('BaseLayout script storedTheme: ' + storedTheme);
      log('BaseLayout script systemPrefersDark: ' + systemPrefersDark);
      log('BaseLayout script shouldUseDark: ' + shouldUseDark);
      if (shouldUseDark) {
        document.documentElement.classList.add('is-dark-mode');
      }
      document.documentElement.dataset.initialTheme =
        typeof storedTheme === 'string' && storedTheme
          ? storedTheme
          : systemPrefersDark
            ? 'dark'
            : 'light';
    } catch (e) {
      console.error('BaseLayout script: Theme init failed', e);
    }
  };

  // Synchronize document language with stored preference.
  const initLang = () => {
    try {
      const storedLang = win.__storageHelper.get(langKey);
      const docLang = document.documentElement.getAttribute('lang') || 'zh-CN';
      const lang = typeof storedLang === 'string' && storedLang ? storedLang : docLang;
      log('BaseLayout script storedLang: ' + storedLang);
      log('BaseLayout script docLang: ' + docLang);
      log('BaseLayout script lang: ' + lang);
      document.documentElement.lang = lang;
      document.documentElement.dataset.initialLang = docLang;
      window.addEventListener('langChanged', (e: Event) => {
        try {
          const detail = (e as CustomEvent<string>).detail;
          win.__storageHelper.set(langKey, detail);
          document.documentElement.lang = detail;
        } catch (err) {
          console.error('BaseLayout script 语言同步失败', err);
        }
      });
    } catch (e) {
      console.error('BaseLayout script: Lang init failed', e);
    }
  };

  // Update document.title according to current language values.
  const initTitle = () => {
    try {
      const zh = titleZh;
      const en = titleEn;
      if (!zh && !en) return;
      const setTitle = () => {
        const lang = document.documentElement.lang || 'zh-CN';
        if (lang.startsWith('zh') && zh) {
          document.title = zh;
        } else if (!lang.startsWith('zh') && en) {
          document.title = en;
        }
      };
      setTitle();
      window.addEventListener('langChanged', () => setTitle());
    } catch (e) {
      console.error('BaseLayout script: Title init failed', e);
    }
  };

  try {
    initTheme();
    initLang();
    initTitle();
  } catch (e) {
    console.error('Initialization failed', e);
    document.documentElement.dataset.initialTheme = 'light';
    document.documentElement.dataset.initialLang = 'zh-CN';
  }
})();
