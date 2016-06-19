/*
 * LoginApp
 *
 * Authentication page
 *
 */
import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import logo from './unidesq-black-logo.png';
import './styles.scss';

const msgs = defineMessages({
  welcome: {
    id: 'app.login_page.container.message',
    description: 'Welcome message in login box',
    defaultMessage: 'Welcome back. Please log in.',
  },
  home: {
    id: 'app.login_app.header.home',
    description: 'home',
    defaultMessage: 'Home',
  },
  getAccount: {
    id: 'app.login_app.header.get_account',
    description: 'Want to get an account header message',
    defaultMessage: 'want to get an account?',
  },
  staySigned: {
    id: 'app.login_app.container.stay_signed',
    description: 'Stay signed message',
    defaultMessage: 'Stay signed-in for 2 weeks',
  },
  forgot: {
    id: 'app.login_app.container.forgot',
    description: 'Text for forgot password link',
    defaultMessage: 'Forgot password?',
  },
});

export default class LoginApp extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <section className="LoginApp">
        <header className="LoginApp-header">
          <div className="LoginApp-headerHome">
            <a>
              <FormattedMessage {...msgs.home} />
            </a>
          </div>
          <figure className="LoginApp-headerLogo">
            <img src={logo} alt="logo unidesq" />
          </figure>
          <div className="LoginApp-headerGetAccount">
            <a>
              <FormattedMessage {...msgs.getAccount} />
            </a>
          </div>
        </header>
        <main className="LoginApp-container">
          {this.props.children}
        </main>
      </section>
    );
  }
}

LoginApp.propTypes = {
  children: PropTypes.node,
};
