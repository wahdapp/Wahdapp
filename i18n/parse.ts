export default function parseLanguage(lang: string) {
  const code = lang.toLowerCase();
  // Traditional Chinese
  if (code.includes('zh-hant') || code.includes('tw')) {
    return 'zh_hant';
  }
  // Simplified Chinese
  if (code.includes('zh-hans') || code.includes('cn')) {
    return 'zh_hans';
  }
  // Turkish
  if (code.includes('tr')) {
    return 'tr';
  }
  // Russian
  if (code.includes('ru')) {
    return 'ru';
  }
  // French
  if (code.includes('fr')) {
    return 'fr';
  }
  // Arabic
  if (code.includes('ar')) {
    return 'ar';
  }

  // Set English as default
  return 'en';
}
