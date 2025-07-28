import { useLanguage } from '../context/LanguageContext';

export default function useContent(contentMap) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  return contentMap[langKey];
}
