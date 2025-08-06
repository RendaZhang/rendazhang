import { useLanguage } from '../components/providers';

export default function useContent<T>(contentMap: Record<'en' | 'zh', T>): T {
  const { lang } = useLanguage();
  const langKey: 'en' | 'zh' = lang && lang.startsWith('zh') ? 'zh' : 'en';
  return contentMap[langKey];
}
