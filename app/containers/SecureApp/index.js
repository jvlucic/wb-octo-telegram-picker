/*
 * Secure Page
 *
 * Part of application that is secure
 *
 */

import React from 'react';
import SecureHeader from 'components/SecureHeader';
import './styles.scss';

export default class SecurePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <section className="SecureApp">
        <SecureHeader />
        <article className="SecureApp-content">{React.Children.only(React.cloneElement(this.props.children, { addAlert: this.props.addAlert }))}</article>
        <footer></footer>
      </section>
    );
  }
}
SecurePage.propTypes = {
  children: React.PropTypes.node,
  addAlert: React.PropTypes.func,
};
