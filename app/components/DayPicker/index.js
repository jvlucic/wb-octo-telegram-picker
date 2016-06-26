import React, { Component, PropTypes } from 'react';
import DayPicker, * as Utils from 'react-day-picker';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLocale } from 'intl/selectors';

import 'react-day-picker/lib/style.css';
import './styles.scss';

const WEEKDAYS_LONG = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  es: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
};

const WEEKDAYS_SHORT = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  es: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
};

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

const FIRST_DAY = {
  en: 0,
  es: 1,
};

const localeUtils = {
  formatDay: (day, locale = 'es') => `${WEEKDAYS_LONG[locale][day.getDay()]}, ${day.getDate()} ${MONTHS[locale][day.getMonth()]} ${day.getFullYear()}`,
  formatMonthTitle: (day, locale) => `${MONTHS[locale][day.getMonth()]} ${day.getFullYear()}`,
  formatWeekdayShort: (index, locale) => WEEKDAYS_SHORT[locale][index],
  formatWeekdayLong: (index, locale) => WEEKDAYS_LONG[locale][index],
  getFirstDayOfWeek: (locale) => FIRST_DAY[locale],
};

export const DateUtils = Utils.DateUtils;
export const LocaleUtils = Utils.LocaleUtils;
export const NavbarPropTypes = Utils.NavbarPropTypes;

class CustomDayPicker extends Component {
  showMonth(...args) {
    this.daypicker.showMonth(...args);
  }

  render() {
    const { locale, ...otherProps } = this.props;
    return (
      <DayPicker
        locale={locale}
        localeUtils={localeUtils}
        ref={daypicker => { this.daypicker = daypicker; }}
        {...otherProps}
      />
    );
  }

}

CustomDayPicker.propTypes = {
  locale: PropTypes.string,
};

CustomDayPicker.defaultProps = {
  locale: 'en',
};

export default connect(createStructuredSelector({
  locale: selectLocale(),
}), undefined, undefined, { withRef: true })(CustomDayPicker);
