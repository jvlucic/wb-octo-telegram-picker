import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import { InputCalendarIcon, InputClearIcon } from 'theme/assets';
import moment from 'moment';
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
    const { date, active, onClick, label, onClean } = this.props;
    const isActive = classnames({ 'is-active': active });
    return (
      <div className={classnames('InputDate', isActive)}  >
        <div className={classnames('InputDate-inside', isActive)} onClick={onClick} >
          <div className="InputDate-clickable" >
            <div className={classnames('InputDate-value', isActive)}>
              {
                date instanceof Date && moment(date).format('DD.MM.YYYY') || label
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InputDate.propTypes = {
  date: PropTypes.instanceOf(Date),
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onClean: PropTypes.func,
};

InputDate.defaultProps = {
  onClick() {},
  onClean() {},
  active: false,
};
