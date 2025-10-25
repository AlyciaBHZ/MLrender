import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export function useI18n() {
  const { t, i18n: instance } = useTranslation();
  return {
    t: (key: any, opts?: any) => {
      const k = String(key);
      // Enforce: zh locale uses English names for components (node.*)
      if ((instance.language === 'zh') && k.startsWith('node.')) {
        return instance.t(k, { ...(opts || {}), lng: 'en' });
      }
      return t(k as any, opts as any);
    },
    lang: instance.language,
    setLang: (lng: string) => instance.changeLanguage(lng),
  };
}

export default i18n;
