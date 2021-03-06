import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './styles.scss';

export default function FormGroup({ htmlFor, className, error, touched, labelText, children }) {
  const classStates = classnames({
    'has-error': !!error && touched,
  });

  return (
    <div className={classnames('FormGroup', className, classStates)}>
      {labelText &&
        <label htmlFor={htmlFor} className={classnames('FormGroup-label', classStates)}>
          {labelText}
        </label>
      }
      {children}
      <div className={classnames('FormGroup-error', classStates)}>
        <span>{error}</span>
      </div>
    </div>
  );
}

FormGroup.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  labelText: PropTypes.string,
  children: PropTypes.node,
};
