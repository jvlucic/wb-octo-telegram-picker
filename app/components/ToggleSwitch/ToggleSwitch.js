/**
 * Created by mongoose on 15/06/16.
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import './ToggleSwitch.scss';
class ToggleSwitch extends Component {

  constructor(props, context) {
    super(props, context);

    let checked = false;
    if ('checked' in props) {
      checked = props.checked;
    } else if ('defaultChecked' in props) {
      checked = props.defaultChecked;
    }
    this.state = {
      checked: !!checked,
      hasFocus: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({ checked: !!nextProps.checked });
    }
  }

  handleClick(event) {
    const checkbox = this.refs.input;
    event.preventDefault();
    event.stopPropagation();
    if (event.target !== checkbox) {
      checkbox.focus();
      checkbox.click();
      return;
    }

    if (!('checked' in this.props)) {
      this.setState({ checked: checkbox.checked });
    }
  }

  handleFocus() {
    this.setState({ hasFocus: true });
  }

  handleBlur() {
    this.setState({ hasFocus: false });
  }

  render() {
    const classes = classNames('react-toggle', {
      'react-toggle--checked': this.state.checked,
      'react-toggle--focus': this.state.hasFocus,
      'react-toggle--disabled': this.props.disabled,
      'react-toggle--loading': this.props.loading,
    });

    return (
      <div className={classes} onClick={this.handleClick}>
        <div className="react-toggle-track"></div>
        <div className="react-toggle-thumb"></div>
        <input
          ref="input"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="react-toggle-screenreader-only"
          type="checkbox"
          {...this.props}
        />
      </div>
    );
  }
}

ToggleSwitch.propTypes = {
  checked: React.PropTypes.bool,
  defaultChecked: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  name: React.PropTypes.string,
  value: React.PropTypes.string,
  id: React.PropTypes.string,
  'aria-labelledby': React.PropTypes.string,
  'aria-label': React.PropTypes.string,
};

export default ToggleSwitch;
