import moment from 'moment';
import 'moment/locale/zh-tw';
import 'moment/locale/zh-cn';
import { auth } from 'firebaseDB';

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
  switch (language) {
    case 'en':
      moment.locale('en');
      auth.languageCode = 'en';
      break;
    case 'zh_hant':
      moment.locale('zh-tw');
      auth.languageCode ='zh-TW';
      break;
    case 'zh_hans':
      moment.locale('zh-cn');
      auth.languageCode = 'zh-CN';
      break;
    default:
      moment.locale('en');
      auth.languageCode = 'en';
  }
}

export function formatAgo(t, timestamp) {
  const now = moment();

  const minDiff = now.diff(moment(timestamp), 'minutes');
  if (minDiff < 60) {
    return t('TIME_DIFF.MIN_AGO', { count: minDiff });
  }

  const hourDiff = now.diff(moment(timestamp), 'hours');
  if (hourDiff < 24) {
    return t('TIME_DIFF.HOUR_AGO', { count: hourDiff });
  }

  const dayDiff = now.diff(moment(timestamp), 'days');
  if (dayDiff < 31) {
    return t('TIME_DIFF.DAY_AGO', { count: dayDiff });
  }

  const monthDiff = now.diff(moment(timestamp), 'months');
  if (monthDiff < 12) {
    return t('TIME_DIFF.MONTH_AGO', { count: monthDiff });
  }

  const yearDiff = now.diff(moment(timestamp), 'years');
  return t('TIME_DIFF.YEAR_AGO', { count: yearDiff });
}