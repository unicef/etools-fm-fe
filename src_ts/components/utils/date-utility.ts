import {logWarn} from '@unicef-polymer/etools-behaviors/etools-logging.js';

export function isValidDate(date: any): boolean {
  return !(date instanceof Date) ? false : date.toString() !== 'Invalid Date';
}

export function prettyDate(dateString: string, format?: string, placeholder = '-'): string | '' | Response {
  const date: Date | null = convertDate(dateString);
  return !date ? (placeholder ? placeholder : '') : _utcDate(date, format);
}

function _utcDate(date: any, format?: string): string {
  return !date ? '' : dayjs.utc(date).format(format ? format : 'D MMM YYYY');
}

export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

export function convertDate(dateString: string, noZTimezoneOffset?: boolean): null | Date {
  if (dateString !== '') {
    dateString = !dateString.includes('T') ? dateString + 'T00:00:00' : dateString;
    /**
     * `Z` (zero time offset) will ensure `new Date` will create the date in UTC and then it will apply local timezone
     * and will have the same result in all timezones (for the UTC date).
     * Example:
     *  d = new Date('2018-04-25T00:00:00Z');
     *  d.toString() == "Wed Apr 25 2018 03:00:00 GMT+0300 (EEST)"
     *  d.toGMTString() == "Wed, 25 Apr 2018 00:00:00 GMT"
     * @type {string}
     */
    dateString += noZTimezoneOffset || dateString.includes('Z') ? '' : 'Z';
    const date: Date = new Date(dateString);
    const isValid: boolean = isValidDate(date);
    if (!isValid) {
      logWarn('Date conversion unsuccessful: ' + dateString);
    }
    return isValid ? date : null;
  }
  return null;
}
