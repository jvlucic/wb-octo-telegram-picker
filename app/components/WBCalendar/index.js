import React, { Component, PropTypes } from 'react';
import DayPicker, { DateUtils } from 'components/DayPicker';
import InputDate from 'components/InputDate';
import classnames from 'classnames';
import { Overlay } from 'react-overlays';
import './styles.scss';

const INPUT_DATE_TYPE = {
  START: 'from',
  END: 'to',
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    // Binding methods
    this.handleHideDate = this.handleHideDate.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleOnInputClick = this.handleOnInputClick.bind(this);
    this.handleApply = this.handleApply.bind(this);

    /**
     * @type {Object}
     * @property show               - If the day picker is shown or not
     * @property to                 - Date 'from' day picker
     * @property from               - Date 'to' day picker
     */
    this.state = {
      show: false,
      to: props.to,
      from: props.from,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.to !== this.props.to && nextProps.from !== this.props.from) {
      this.setState({
        to: nextProps.to,
        from: nextProps.from,
      });
    }
  }

  handleDayClick(event, day, type) {
    const state = {};
    if (this.state.activeInput === INPUT_DATE_TYPE.START) {

      if (!this.state.from || (this.state.from > day)) {
        state.from = day;
        state.activeInput = INPUT_DATE_TYPE.END;
        this.setState(state);
      }

      if (this.state.from < day) {
        state.from = day;
        state.activeInput = INPUT_DATE_TYPE.END;
        if (this.state.to && this.state.to <= day) {
          state.to = null
        }
        this.setState(state);
      }
    }

    if (this.state.activeInput === INPUT_DATE_TYPE.END) {
      if (!this.state.to || (this.state.to < day)) {
        state.to = day;
        this.setState(state);
        this.handleHideDate();
      }

      if (this.state.to >= day) {
        state.to = day;
        if (!this.state.from || (this.state.from && this.state.from >= day)) {
          state.activeInput = INPUT_DATE_TYPE.START;
          state.from = null;
          this.setState(state);
        }else{
          this.setState(state);
          this.handleHideDate()
        }
      }
    }
  }

  handleHideDate() {
    if (!this.activeInput) {
      this.setState({
        show: false,
        activeInput: false,
      });
    }
  }

  handleOnInputClick(event, type) {
    this.setState({
      show: true,
      activeInput: type,
    }, () => this.daypicker.getWrappedInstance().daypicker.showMonth(this.state.to || new Date()));
    /* HACK in order to not close the overlay when clicking the inputs */
    this.activeInput = type;
    setTimeout(() => {
      this.activeInput = false
    }, 1);
  }

  handleApply() {
    const { to, from } = this.state;
    this.props.onChange({ to, from });
    this.handleHideDate();
  }

  render() {
    const { to, from, onClean } = this.props;
    const modifiers = {
      selected: day => DateUtils.isDayInRange(day, this.state),
      startDay: day => DateUtils.isSameDay(day, this.state.from),
      endDay: day => DateUtils.isSameDay(day, this.state.to),
    };
    const isDisabled = !(this.state.to instanceof Date) || !(this.state.from instanceof Date);
    const isDisabledClassName = classnames({
      'is-disabled': isDisabled,
    });
    return (
      <div className={classnames('Calendar')}>
        <InputDate
          date={this.state.from}
          label={'Check-in'}
          refs={_input => { this.input = _input; }}
          onClick={(event, day) => this.handleOnInputClick(event, INPUT_DATE_TYPE.START)}
          onClean={onClean}
          active={this.state.show && this.state.activeInput === INPUT_DATE_TYPE.START}
        />
        <InputDate
          date={this.state.to}
          label={'Check-out'}
          refs={_input => { this.input = _input; }}
          onClick={(event, day) => this.handleOnInputClick(event, INPUT_DATE_TYPE.END)}
          onClean={onClean}
          active={this.state.show && this.state.activeInput === INPUT_DATE_TYPE.END}
        />

        <Overlay
          placement="bottom"
          onHide={this.handleHideDate}
          show={this.state.show}
          container={this}
          target={this.input}
          rootClose
        >
          <div
            className={classnames('Calendar-overlay')}
          >
            <DayPicker
              ref="daypicker"
              numberOfMonths={2}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
              ref={(daypicker) => { this.daypicker = daypicker; }}
            />
          </div>
        </Overlay>

      </div>
    );
  }
}

Calendar.propTypes = {
  to: PropTypes.instanceOf(Date),
  from: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  onClean: PropTypes.func,
};

Calendar.defaultProps = {
  onChange() {},
  onClean() {},
};

export default Calendar;
