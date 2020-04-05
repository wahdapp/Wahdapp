export default function parseLanguage(lang) {
  let code = lang.toLowerCase();
  // English
  if (code.includes('en')) {
    return 'en';
  }
  if (code.includes('zh-hant') || code.includes('tw')) {
    return 'zh-TW';
  }
  if (code.includes('zh-hans') || code.includes('cn')) {
    return 'zh-CN';
  }
}