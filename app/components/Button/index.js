import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './styles.scss';

export default function Button({ children, buttonType, expanded, className, ...otherProps }) {
  return (
    <button
      {...otherProps}
      className={classnames('Button Button--primary', className, {
        'Button--large': buttonType === 'large',
        'is-expanded': expanded,
      })}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  buttonType: PropTypes.oneOf(['normal', 'large']),
  expanded: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  buttonType: 'normal',
  expanded: false,
};
