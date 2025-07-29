import { useLanguage } from '../components/providers';

export default function useContent(contentMap) {
  const { lang } = useLanguage();
  const langKey = lang && lang.startsWith('zh') ? 'zh' : 'en';
  return contentMap[langKey];
}
