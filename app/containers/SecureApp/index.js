/*
 * Secure Page
 *
 * Part of application that is secure
 *
 */

import React from 'react';
import SecureHeader from 'components/SecureHeader';

export default class SecurePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <section className="SecurePage">
        <SecureHeader />
        <article>{React.Children.only(this.props.children)}</article>
        <footer></footer>
      </section>
    );
  }
}
SecurePage.propTypes = {
  children: React.PropTypes.node,
};
