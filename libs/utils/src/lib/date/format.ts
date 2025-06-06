import { DateTime } from 'luxon';

export const formatISO = (
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
) => {
  if (!isoDate) {
    return null;
  }

  const d = new Date(isoDate);
  return d.toLocaleString('no-NO', options);
};

export const dateStringToDate = (dateString: string) => {
  const dateStringTimestamp = Date.parse(dateString);
  const date = new Date(dateStringTimestamp);
  date.setHours(0, 0, 0, 0);
  return !isNaN(dateStringTimestamp) ? date : null;
};

export const formatDate = (date: Date | null) =>
  date
    ? date
        .toLocaleDateString('nb-NO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .split('/')
        .join('.')
    : '';

const isDateSameDayAsNow = (date: Date) =>
  date.getFullYear() === new Date().getFullYear() &&
  date.getMonth() === new Date().getMonth() &&
  date.getDate() === new Date().getDate();

export const isDateBeforeToday = (date: Date | null) =>
  date && date.getTime() < Date.now() && !isDateSameDayAsNow(date);

export const isDateAfterToday = (date: Date | null) => date && date.getTime() > Date.now() && !isDateSameDayAsNow(date);

export const parseDateTime = (value: any) => {
  if (!value) {
    return null;
  }

  let dateTime = DateTime.fromJSDate(value);
  if (dateTime.isValid) {
    return dateTime;
  }

  dateTime = DateTime.fromFormat(value, 'yyyy-MM-dd');
  if (dateTime.isValid) {
    return dateTime;
  }

  return null;
};

export const formatDateToDDMMYYYY = (isoDate: string | undefined) => {
  if (!isoDate) return null;

  const date = DateTime.fromISO(isoDate);
  return date.isValid ? date.toFormat('dd.MM.yyyy') : null;
};
