import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { InputPasswordIcon, InputPasswordShowIcon, InputErrorIcon, InputCheckboxIcon } from 'theme/assets';
import './styles.scss';

/**
 * Component to handle password case
 */
export default class Input extends Component {
  constructor(props) {
    super(props);

    this.handleOnShowClick = this.handleOnShowClick.bind(this);
    this.state = {
      type: props.type,
    };
  }

  handleOnShowClick() {
    const newType = this.input.type === 'password' ? 'text' : 'password';
    this.input.type = newType;
    this.setState({
      type: newType,
    });
  }

  renderInput() {
    const { className, error, valid, touched, submitted, type, onChange, onBlur, value, onFocus, placeholder } = this.props;
    const stateClass = classnames({
      'has-error': !!error && (touched || submitted),
      'is-valid': !!valid && (touched || submitted),
    });

    return (
      <div className={classnames('Input-container', className)}>
        <input
          type={type}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value}
          onFocus={onFocus}
          className={classnames('Input', stateClass)}
          ref={(c) => { this.input = c; }}
        />
        <InputCheckboxIcon className={classnames('Input-checkIcon', stateClass)} />
        <InputErrorIcon className={classnames('Input-errorIcon', stateClass)} />
      </div>
    );
  }

  render() {
    const { className, type } = this.props;
    if (type === 'password') {
      const IconInputPassword = (this.state.type === 'password' ? InputPasswordShowIcon : InputPasswordIcon);
      return (
        <div className={classnames('Input-password', className)}>
          {this.renderInput()}
          <IconInputPassword className="Input-passwordIcon" onClick={this.handleOnShowClick} />
        </div>
      );
    }

    return this.renderInput();
  }
}

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  valid: PropTypes.bool,
  touched: PropTypes.bool,
  submitted: PropTypes.bool,
  type: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
};

Input.defaultProps = {
  behaviour: 'normal',
  type: 'text',
};
