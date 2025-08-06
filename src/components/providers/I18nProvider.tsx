import { createContext, useState, useEffect, useContext, useRef, type ReactNode, type ReactElement } from 'react';
import { LANG_STORAGE_KEY } from '../../constants/index.ts';
import storage from '../../utils/storage';
import * as Sentry from '@sentry/react';

interface I18nContextValue {
  lang: string;
  updateLang: (newLang: string) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLang?: string;
}

export function I18nProvider({ children, initialLang }: I18nProviderProps): ReactElement {
  const initialSet = useRef<boolean>(false);

  // Use the server-rendered language as the initial state to avoid
  // hydration mismatches. The actual preferred language will be
  // resolved on the client in the effect below.
  const [lang, setLang] = useState<string>(initialLang || 'zh-CN');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!initialSet.current) {
      initialSet.current = true;

      const domLang =
        document.documentElement.dataset.initialLang ||
        document.documentElement.lang ||
        initialLang ||
        'zh-CN';
      let storedLang: string | null = null;
      try {
        storedLang = storage.get(LANG_STORAGE_KEY);
        console.log('I18nProvider storedLang: ' + storedLang);
      } catch (e) {
        console.error(
          'I18nProvider failed to get storedLand with LANG_STORAGE_KEY ' + LANG_STORAGE_KEY
        );
        Sentry.captureException(e);
      }
      // 首次挂载时优先使用本地存储的语言设置
      const effectiveLang = storedLang || domLang;
      setLang(effectiveLang);
      document.documentElement.lang = effectiveLang;
      try {
        storage.set(LANG_STORAGE_KEY, effectiveLang);
        console.log('I18nProvider effectiveLang: ' + effectiveLang);
      } catch (e) {
        console.error(
          'I18nProvider failed to set effectiveLang with LANG_STORAGE_KEY ' + LANG_STORAGE_KEY
        );
        Sentry.captureException(e);
      }
      window.dispatchEvent(new CustomEvent('langChanged', { detail: effectiveLang }));
      return;
    }

    document.documentElement.lang = lang;
    try {
      storage.set(LANG_STORAGE_KEY, lang);
      console.log('I18nProvider lang: ' + lang);
    } catch (e) {
      console.error('I18nProvider failed to set lang with LANG_STORAGE_KEY ' + LANG_STORAGE_KEY);
      Sentry.captureException(e);
    }
    window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
  }, [lang, initialLang]);

  const updateLang = (newLang: string) => {
    setLang(newLang);
  };

  return <I18nContext.Provider value={{ lang, updateLang }}>{children}</I18nContext.Provider>;
}

export function useLanguage(): I18nContextValue {
  const context = useContext(I18nContext);

  const getDomLang = () => {
    if (typeof document === 'undefined') return 'zh-CN';
    return document.documentElement.dataset.initialLang || document.documentElement.lang || 'zh-CN';
  };

  const [lang, setLang] = useState<string>(() => context?.lang || getDomLang());

  useEffect(() => {
    if (context) {
      setLang(context.lang);
      return;
    }
    const handler = (e: Event) => setLang((e as CustomEvent<string>).detail);
    window.addEventListener('langChanged', handler as EventListener);
    return () => window.removeEventListener('langChanged', handler as EventListener);
  }, [context]);

  const updateLang =
    context?.updateLang ||
    ((newLang: string) => {
      setLang(newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
        try {
          storage.set(LANG_STORAGE_KEY, newLang);
          console.log('I18nProvider newLang: ' + newLang);
        } catch (e) {
          console.error(
            'I18nProvider failed to set newLang with LANG_STORAGE_KEY ' + LANG_STORAGE_KEY
          );
          Sentry.captureException(e);
        }
        window.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
      }
    });

  return { lang, updateLang };
}
