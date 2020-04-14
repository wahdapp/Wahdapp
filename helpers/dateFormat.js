import moment from 'moment';
import 'moment/locale/zh-tw';
import 'moment/locale/zh-cn';

export function formatDay(t, date) {
  const today = moment();
  const tomorrow = moment().add(1, 'days');
  const yesterday = moment().add(-1, 'days');
  if (today.isSame(date, 'day')) {
    return t('DAY.TODAY');
  }
  if (tomorrow.isSame(date, 'day')) {
    return t('DAY.TOMORROW');
  }
  if (yesterday.isSame(date, 'day')) {
    return t('DAY.YESTERDAY');
  }
  return date.format('MMM DD');
}

export function formatLanguage(language) {
  switch(language) {
    case 'en':
      moment.locale('en');
      break;
    case 'zh_hant':
      moment.locale('zh-tw');
      break;
    case 'zh_hans':
      moment.locale('zh-cn');
      break;
    default:
      moment.locale('en');
  }
}