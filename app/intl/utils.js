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
      return intl.formatNumber(value, { style: 'percent' });
    }
    case constants.VALUE_TYPE.NUMBER: {
      return intl.formatNumber(value);
    }
    default:
      return value;
  }
}
