import React, { Component, PropTypes } from 'react';
import DayPicker, { DateUtils } from 'components/DayPicker';
import InputDate from 'components/InputDate';
import moment from 'moment';
import classnames from 'classnames';
import { Overlay } from 'react-overlays';
import './styles.scss';

function ShortCutDay({ name, onClick }) {
  return (
    <div className="ShortCutDay" onClick={onClick}>
      <div className="ShortCutDay-name">
        {name}
      </div>
    </div>
  );
}

ShortCutDay.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};


class Calendar extends Component {
  constructor(props) {
    super(props);

    // Binding methods
    this.handleShowDate = this.handleShowDate.bind(this);
    this.handleHideDate = this.handleHideDate.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleOnInputClick = this.handleOnInputClick.bind(this);
    this.handleApply = this.handleApply.bind(this);

    /**
     * @type {Object}
     * @property show               - If the day picker is shown or not
     * @property recentlyShowing    - Was showed recentrly the day picker (fix bug)
     * @property to                 - Date 'from' day picker
     * @property from               - Date 'to' day picker
     */
    this.state = {
      show: false,
      recentlyShowing: false,
      to: props.to,
      from: props.from,
    };
  }

  componentWillUnmount() {
    if (this.delay) {
      clearTimeout(this.delay);
    }
  }

  handleResetClick(event) {
    event.preventDefault();
    this.setState({
      from: null,
      to: null,
    });
  }

  handleDayClick(event, day) {
    const { to, from } = DateUtils.addDayToRange(day, this.state);
    this.setState({ to, from });
  }

  updateRange(to, from = to) {
    this.setState({ to, from });
  }

  handleShowDate() {
    this.setState({
      show: true,
      recentlyShowing: true,
    });
    this.delay = setTimeout(() => {
      this.setState({
        recentlyShowing: false,
      });
    }, 400);
  }

  handleHideDate() {
    if (!this.state.recentlyShowing) {
      this.setState({
        show: false,
      });
    }
  }

  handleOnInputClick() {
    this.setState({
      show: true,
    });
  }

  handleApply() {
    const { to, from } = this.state;
    this.props.onChange({ to, from });
    this.handleHideDate();
  }

  render() {
    const { to, from } = this.props;
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
          to={to}
          from={from}
          refs={_input => { this.input = _input; }}
          onClick={this.handleOnInputClick}
          active={this.state.show}
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
            <div className="Calendar-ShortCuts">
              <ShortCutDay
                name="Today"
                onClick={() => this.updateRange(new Date())}
              />
              <ShortCutDay
                name="This Week"
                onClick={() => this.updateRange(moment().startOf('week').toDate(), new Date())}
              />
              <ShortCutDay
                name="This Month"
                onClick={() => this.updateRange(moment().startOf('month').toDate(), new Date())}
              />
              <ShortCutDay
                name="This Year"
                onClick={() => this.updateRange(moment().startOf('year').toDate(), new Date())}
              />
              <ShortCutDay
                name="Yesterday"
                onClick={() => this.updateRange(
                  moment()
                    .subtract(1, 'day')
                    .toDate(),
                  moment()
                    .subtract(1, 'day')
                    .toDate()
                )}
              />
              <ShortCutDay
                name="Last Week"
                onClick={() => this.updateRange(
                  moment()
                    .subtract(1, 'week')
                    .startOf('week')
                    .toDate(),
                  moment()
                  .subtract(1, 'week')
                  .endOf('week')
                  .toDate(),
                )}
              />
              <ShortCutDay
                name="Last Month"
                onClick={() => this.updateRange(
                  moment()
                    .subtract(1, 'month')
                    .startOf('month')
                    .toDate(),
                  moment()
                  .subtract(1, 'month')
                  .endOf('month')
                  .toDate(),
                )}
              />
              <ShortCutDay
                name="Last Year"
                onClick={() => this.updateRange(
                  moment()
                    .subtract(1, 'year')
                    .startOf('year')
                    .toDate(),
                  moment()
                  .subtract(1, 'year')
                  .endOf('year')
                  .toDate(),
                )}
              />
            </div>
            <DayPicker
              ref="daypicker"
              numberOfMonths={2}
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
            />
            <div className="Calendar-buttonContainer">
              <button
                type="button"
                onClick={this.handleApply}
                disabled={isDisabled}
                className={classnames('Calendar-button', isDisabledClassName)}
              >
                Apply
              </button>
            </div>

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
};

Calendar.defaultProps = {
  onChange() {

  },
};

export default Calendar;
