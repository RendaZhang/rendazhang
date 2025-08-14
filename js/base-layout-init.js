// BaseLayout initialization script (generated from src/scripts/base-layout-init.ts)
// Loads before rendering to apply stored theme, language and title preferences.
(() => {
  const dataset = document.currentScript?.dataset || {};
  const { themeKey = '', langKey = '', titleZh = '', titleEn = '', isProd = 'true', loginKey = '' } = dataset;

  const isProduction = isProd === 'true';
  const log = (...args) => {
    if (!isProduction) console.log(...args);
  };

  const win = window;

  // Avoid running twice if script is included multiple times.
  if (win.__storageInitialized) return;
  win.__storageInitialized = true;

  // Lightweight storage helper without external dependencies.
  win.__storageHelper = {
    __version: '1.0',
    get(key) {
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
    set(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {}
    }
  };

  // Apply persisted or system theme before paint.
  const initTheme = () => {
    try {
      const storedTheme = win.__storageHelper.get(themeKey);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
      log('BaseLayout script storedTheme: ' + storedTheme);
      log('BaseLayout script systemPrefersDark: ' + systemPrefersDark);
      log('BaseLayout script shouldUseDark: ' + shouldUseDark);
      if (shouldUseDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
      document.documentElement.dataset.initialTheme = shouldUseDark ? 'dark' : 'light';
    } catch (e) {
      console.error('BaseLayout script: Theme init failed', e);
    }
  };

  // Apply stored language and persist changes.
  const initLang = () => {
    try {
      const storedLang = win.__storageHelper.get(langKey);
      const docLang = document.documentElement.getAttribute('lang') || 'zh-CN';
      const lang = storedLang || docLang;
      log('BaseLayout script storedLang: ' + storedLang);
      log('BaseLayout script docLang: ' + docLang);
      log('BaseLayout script lang: ' + lang);
      document.documentElement.lang = lang;
      document.documentElement.dataset.initialLang = docLang;
      window.addEventListener('langChanged', (e) => {
        try {
          const detail = e.detail;
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

  // Set page title according to current language.
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

  const initAuth = () => {
    try {
      const logged = win.__storageHelper.get(loginKey);
      document.documentElement.dataset.loggedIn = logged ? 'true' : 'false';
    } catch (e) {
      console.error('BaseLayout script: Auth init failed', e);
      document.documentElement.dataset.loggedIn = 'false';
    }
  };

  try {
    initTheme();
    initLang();
    initTitle();
    initAuth();
  } catch (e) {
    console.error('Initialization failed', e);
    document.documentElement.dataset.initialTheme = 'light';
    document.documentElement.dataset.initialLang = 'zh-CN';
    document.documentElement.dataset.loggedIn = 'false';
  }
})();
