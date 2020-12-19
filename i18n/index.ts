import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_hant from './zh_hant.json';
import zh_hans from './zh_hans.json';
import en from './en.json';
import id from './id.json';
import fr from './fr.json';
import parseLanguage from './parse';

const resources = {
  en: en,
  zh_hant: zh_hant,
  zh_hans: zh_hans,
  id,
  fr,
  ar: en, //ar
  ru: en, //ru
  tr: en, //tr
  az: en, //az
  ms: en, //ms
};

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    return Localization.getLocalizationAsync().then(({ locale }) => {
      callback(parseLanguage(locale));
    });
  },
  init: () => {
    console.log('init');
  },
  cacheUserLanguage: () => {
    console.log('cache');
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
