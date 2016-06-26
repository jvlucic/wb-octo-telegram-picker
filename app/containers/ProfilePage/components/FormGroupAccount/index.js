import React, { PropTypes } from 'react';
import FormGroup from 'components/FormGroup';
import classnames from 'classnames';
import './styles.scss';

export default function FormGroupAccount({ className, children, ...props }) {
  return (
    <FormGroup {...props} className={classnames('ProfileFormGroup', className)}>
      {children}
    </FormGroup>
  );
}

FormGroupAccount.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
