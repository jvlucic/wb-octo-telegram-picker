import React from 'react';
import { FormattedNumber, FormattedDate } from 'react-intl';
import constants from '../constants';


export const FormattedNumberDecimals = (props) => <FormattedNumber
  {...props}
  style="decimal"
  minimumFractionDigits={2}
  maximumFractionDigits={2}
/>;

export const FormattedDateLong = (props) => <FormattedDate
  {...props}
  year="numeric"
  month="short"
  day="2-digit"
  weekday="long"
/>;

export function formatNumericValue(value, valueType, currency, intl) {
  switch (valueType) {
    case constants.VALUE_TYPE.CURRENCY: {
      return intl.formatNumber(value, { style: 'currency', currency: currency || 'USD' });
    }
    case constants.VALUE_TYPE.PERCENTAGE: {
      /* WARNING: we assume values received are already multiplied by 100 so, we normalize them */
      return intl.formatNumber(value / 100, { style: 'percent', minimumFractionDigits: 2 });
    }
    case constants.VALUE_TYPE.NUMBER: {
      return intl.formatNumber(value);
    }
    default:
      return value;
  }
}
