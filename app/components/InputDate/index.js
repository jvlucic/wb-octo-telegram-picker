import React, { PropTypes } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

const msgs = defineMessages({
  dates: {
    id: 'app.secure.dashboard.input.date.dates',
    description: 'Dates text of ',
    defaultMessage: 'Dates',
  },
});

export default function InputDate({ to, from }) {
  return (
    <div className="InputDate">
      <div className="InputDate-calendar"></div>
      <div className="InputDate-text">
        <FormattedMessage {...msgs} />
      </div>
      <div className="InputDate-value">
        <FormattedDate value={to} />
        &nbsp;
        <span>-</span>
        &nbsp;
        <FormattedDate value={from} />
      </div>
      <div className="InputDate-clean"></div>
    </div>
  );
}

InputDate.propTypes = {
  to: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
};
