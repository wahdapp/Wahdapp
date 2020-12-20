import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/id';
import 'dayjs/locale/fr';
import 'dayjs/locale/tr';
import { auth } from '@/firebase';
import { TFunction } from 'i18next';

export function formatDay(t: TFunction, date: string) {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  const yesterday = dayjs().add(-1, 'day');

  const dayjsDate = dayjs(date);

  if (today.isSame(dayjsDate, 'day')) {
    return t('DAY.TODAY');
  }
  if (tomorrow.isSame(dayjsDate, 'day')) {
    return t('DAY.TOMORROW');
  }
  if (yesterday.isSame(dayjsDate, 'day')) {
    return t('DAY.YESTERDAY');
  }
  return dayjsDate.format('MMM DD');
}

export function formatLanguage(language: string) {
  switch (language) {
    case 'en':
      dayjs.locale('en');
      auth.languageCode = 'en';
      break;
    case 'zh_hant':
      dayjs.locale('zh-tw');
      auth.languageCode = 'zh-TW';
      break;
    case 'zh_hans':
      dayjs.locale('zh-cn');
      auth.languageCode = 'zh-CN';
      break;
    case 'id':
      dayjs.locale('id');
      auth.languageCode = 'id-ID';
      break;
    case 'fr':
      dayjs.locale('fr');
      auth.languageCode = 'fr-FR';
      break;
    case 'tr':
      dayjs.locale('tr');
      auth.languageCode = 'tr-TR';
      break;
    default:
      dayjs.locale('en');
      auth.languageCode = 'en';
  }
}

export function formatAgo(t: TFunction, timestamp: number | string) {
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
