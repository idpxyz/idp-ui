import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import zh from '../locales/zh/translation.json';

const STORAGE_KEY = 'parcel-web-i18n-lng';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || undefined,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

function applyDocumentLang(lng: string) {
  document.documentElement.lang = lng.startsWith('zh') ? 'zh-CN' : 'en-US';
}

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  applyDocumentLang(lng);
});

applyDocumentLang(i18n.language);

export { STORAGE_KEY };
export default i18n;
