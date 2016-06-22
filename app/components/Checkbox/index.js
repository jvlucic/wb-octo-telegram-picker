import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './styles.scss';

export default function Checkbox({ className, labelText, inputClassName, ...props }) {
  return (
    <label htmlFor="stay-sign-in" className={classnames('Checkbox', className)}>
      <input
        type="checkbox"
        id="stay-sign-in"
        {...props}
        className={classnames('Checkbox-input', inputClassName)}
      />
      <span className="Checkbox-text">{labelText}</span>
    </label>
  );
}

Checkbox.propTypes = {
  className: PropTypes.string,
  labelText: PropTypes.string,
  inputClassName: PropTypes.string,
};
