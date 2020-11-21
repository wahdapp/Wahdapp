// Adjust according to Google Firebase specification
// list: http://www.lingoes.net/en/translator/langcode.htm
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
    case 'id':
      return 'id-ID';
    case 'az':
      return 'az-AZ';
    case 'ms':
      return 'ms';
    default:
      return 'en-US';
  }
};
