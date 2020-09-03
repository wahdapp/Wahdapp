// Adjust according to Google Firebase specification
export const convertLanguageCode = (code) => {
  switch (code) {
    case 'zh_hant':
      return 'zh-TW';
    case 'zh_hans':
      return 'zh-CN';
    default: return 'en';
  }
}