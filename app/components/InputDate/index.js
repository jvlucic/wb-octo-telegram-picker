import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { InputCalendarIcon, InputClearIcon } from 'theme/assets';
import './styles.scss';

const msgs = defineMessages({
  dates: {
    id: 'app.secure.dashboard.input.date.dates',
    description: 'Dates text of ',
    defaultMessage: 'Dates',
  },
});

export default class InputDate extends Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { to, from, active, onClick, onClean } = this.props;
    const isActive = classnames({ 'is-active': active });
    return (
      <div className={classnames('InputDate', isActive)} >
        <div className="InputDate-clickable" onClick={onClick}>
          <InputCalendarIcon className="InputDate-calendar" />
          <div className="InputDate-label">
            <FormattedMessage {...msgs.dates} />
          </div>

          <div className={classnames('InputDate-value', isActive)}>
            {
              from instanceof Date
                && <FormattedDate value={from} />
            }
            {
              to instanceof Date
                && (
                <span>
                  &nbsp;
                  -
                  &nbsp;
                  <FormattedDate value={to} />
                </span>
              )
            }

          </div>
        </div>

        <div className={classnames('InputDate-clean', isActive)} onClick={onClean}>
          <InputClearIcon />
        </div>
      </div>
    );
  }
}

InputDate.propTypes = {
  to: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onClean: PropTypes.func,
};

InputDate.defaultProps = {
  onClick() {},
  onClean() {},
  active: false,
};
