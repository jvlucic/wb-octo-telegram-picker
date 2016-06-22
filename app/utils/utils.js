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
  const dayPart = str.split('T')[0];
  const [year, month, day] = dayPart.split('-');
  const date = new Date(year, month - 1, day);
  return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime()) ? date : null;
}

export function getDayAndMonth(str) {
  if (!str) {
    return null;
  }
  const date = parseDate(str);
  return moment(date).format('MMM DD.');
}


export function setColorAlpha(color, alpha) {
  const parts = color.split(',');
  if (parts.length <= 0) { // NOT RGBA FORMAT
    return color;
  }
  parts[3] = `${alpha})`;
  return parts.join(',');
}
