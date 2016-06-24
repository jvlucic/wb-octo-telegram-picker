/**
 * Created by mongoose on 21/06/16.
 */
import moment from 'moment';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function dateDiffInDays(date, otherDate) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utc2 = Date.UTC(otherDate.getFullYear(), otherDate.getMonth(), otherDate.getDate());
  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

export function parseDate(str) {
  if (!str) {
    return null;
  }
  return moment(str, 'ddd MMM DD HH:mm:ss ZZ YYYY').toDate();
}

export function addDaysToDate(date, days) {
  return moment(date).add(days, 'day').toDate();
}

export function getDayAndMonthFromDate(date) {
  return moment(date).format('MMM DD.');
}

export function getDayAndMonth(str) {
  if (!str) {
    return null;
  }
  const date = parseDate(str);
  return moment(date).format('MMM DD.');
}

export function getHour(str) {
  if (!str) {
    return null;
  }
  const hourPart = str.split(' ')[1];
  const hourt = hourPart.split(':')[0];
  return hourt;
}

export function setColorAlpha(color, alpha) {
  const parts = color.split(',');
  if (parts.length <= 0) { // NOT RGBA FORMAT
    return color;
  }
  parts[3] = `${alpha})`;
  return parts.join(',');
}

export function numberFormatter(num) {
  if (num >= 1000000000) {
    const norm = (num / 1000000000);
    return `${norm.toFixed(norm % 1 !== 0 ? 2 : 0).replace(/\.0$/, '')}G`;
  }
  if (num >= 1000000) {
    const norm = (num / 1000000);
    return `${norm.toFixed(norm % 1 !== 0 ? 2 : 0).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    const norm = (num / 1000);
    return `${norm.toFixed(norm % 1 !== 0 ? 2 : 0).replace(/\.0$/, '')}K`;
  }
  if (num <= 1 && num > 0) {
    return `${(num).toFixed(2).replace(/\.0$/, '')}`;
  }
  return num;
}
