import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_hant from './zh-TW.json';
import en from './en.json';
import parseLanguage from './parse';

const resources = {
  "en": en,
  "zh-TW": zh_hant
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