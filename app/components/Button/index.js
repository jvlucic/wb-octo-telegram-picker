import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { SpinnerIcon } from 'theme/assets';
import './styles.scss';

export default function Button({ children, buttonType, expanded, className, spinner, disabled, ...otherProps }) {
  return (
    <button
      {...otherProps}
      className={classnames('Button Button--primary', className, {
        'Button--large': buttonType === 'large',
        'is-expanded': expanded,
        'is-spinning': spinner,
      })}
      disabled={spinner || disabled}
    >
      <span
        className={classnames('Button-spinner', {
          'is-spinning': spinner,
        })}
      >
        <SpinnerIcon />
      </span>
      <span
        className={classnames('Button-text', {
          'is-spinning': spinner,
        })}
      >
        {children}
      </span>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  buttonType: PropTypes.oneOf(['normal', 'large']),
  expanded: PropTypes.bool,
  spinner: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  buttonType: 'normal',
  expanded: false,
};
