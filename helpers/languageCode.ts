// Adjust according to Google Firebase specification
// list: https://appmakers.dev/bcp-47-language-codes-list/
export const convertLanguageCode = (code: string) => {
  switch (code) {
    case 'zh_hant':
      return 'zh-TW';
    case 'zh_hans':
      return 'zh-CN';
    case 'fr':
      return 'fr-FR';
    case 'ar':
      return 'ar-SA';
    case 'ru':
      return 'ru-RU';
    case 'tr':
      return 'tr-TR';
    default:
      return 'en-US';
  }
};
