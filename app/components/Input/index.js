import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { InputPasswordIcon, InputErrorIcon, InputCheckboxIcon } from 'theme/assets';
import './styles.scss';

/**
 * Component to handle password case
 */
export default class Input extends Component {
  constructor(props) {
    super(props);

    this.handleOnShowClick = this.handleOnShowClick.bind(this);
  }

  handleOnShowClick() {
    this.input.type = this.input.type === 'password' ? 'text' : 'password';
  }

  renderInput() {
    const { className, error, valid, ...props } = this.props;
    const stateClass = classnames({
      'has-error': !!error,
      'is-valid': !!valid,
    });
    return (
      <div className={classnames('Input-container', className)}>
        <input
          {...props}

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
      return (
        <div className={classnames('Input-password', className)}>
          {this.renderInput()}
          <InputPasswordIcon className="Input-passwordIcon" onClick={this.handleOnShowClick} />
        </div>
      );
    }

    return this.renderInput();
  }
}

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.any,
  valid: PropTypes.any,
  type: PropTypes.string,
};

Input.defaultProps = {
  behaviour: 'normal',
};
