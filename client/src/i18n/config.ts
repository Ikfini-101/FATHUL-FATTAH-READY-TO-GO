import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Fichiers de traduction
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector) // Détecte automatiquement la langue du navigateur
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'fr', // Langue par défaut
    supportedLngs: ['fr', 'ar', 'en'],
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    detection: {
      // Ordre de détection de la langue
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Activer le mode RTL pour l'arabe
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;
