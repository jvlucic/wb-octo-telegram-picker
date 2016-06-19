import React, { PropTypes } from 'react';

export default function FormGroup({ id, children }) {
  return (
    <div>
      <label htmlFor={id}></label>
      {children}
      <div>
        <span></span>
      </div>
    </div>
  );
}

FormGroup.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
};
