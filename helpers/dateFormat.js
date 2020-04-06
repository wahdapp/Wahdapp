import moment from 'moment';

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
  return date.format('DD MMM');
}