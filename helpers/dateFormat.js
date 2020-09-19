import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';
import { auth } from 'firebaseDB';

export function formatDay(t, date) {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'days');
  const yesterday = dayjs().add(-1, 'days');
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
      dayjs.locale('en');
      auth.languageCode = 'en';
      break;
    case 'zh_hant':
      dayjs.locale('zh-tw');
      auth.languageCode ='zh-TW';
      break;
    case 'zh_hans':
      dayjs.locale('zh-cn');
      auth.languageCode = 'zh-CN';
      break;
    default:
      dayjs.locale('en');
      auth.languageCode = 'en';
  }
}

export function formatAgo(t, timestamp) {
  const now = dayjs();

  const minDiff = now.diff(dayjs(timestamp), 'minute');
  if (minDiff < 60) {
    return t('TIME_DIFF.MIN_AGO', { count: minDiff });
  }

  const hourDiff = now.diff(dayjs(timestamp), 'hour');
  if (hourDiff < 24) {
    return t('TIME_DIFF.HOUR_AGO', { count: hourDiff });
  }

  const dayDiff = now.diff(dayjs(timestamp), 'day');
  if (dayDiff < 31) {
    return t('TIME_DIFF.DAY_AGO', { count: dayDiff });
  }

  const monthDiff = now.diff(dayjs(timestamp), 'month');
  if (monthDiff < 12) {
    return t('TIME_DIFF.MONTH_AGO', { count: monthDiff });
  }

  const yearDiff = now.diff(dayjs(timestamp), 'year');
  return t('TIME_DIFF.YEAR_AGO', { count: yearDiff });
}