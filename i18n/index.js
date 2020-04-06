import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_hant from './zh_hant.json';
import zh_hans from './zh_hans.json';
import en from './en.json';
import parseLanguage from './parse';

const resources = {
  "en": en,
  "zh_hant": zh_hant,
  "zh_hans": zh_hans
};

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    return /*'en'; */ Localization.getLocalizationAsync().then(({ locale }) => {
      callback(parseLanguage(locale));
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    react: {
      useSuspense: false
    }
  });

export default i18n;