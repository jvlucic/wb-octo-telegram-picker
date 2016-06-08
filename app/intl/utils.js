import React from 'react';
import { FormattedNumber, FormattedDate } from 'react-intl';

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
