/*
 * LoginPage
 *
 * Authentication page
 *
 */
import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Input from 'components/Input';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import logo from './unidesq-black-logo.png';
import './styles.scss';

const msgs = defineMessages({
  welcome: {
    id: 'app.login.container.message',
    description: 'Welcome message in login box',
    defaultMessage: 'Welcome back. Please log in.',
  },
  home: {
    id: 'app.login.header.home',
    description: 'home',
    defaultMessage: 'Home',
  },
  getAccount: {
    id: 'app.login.header.get_account',
    description: 'Want to get an account header message',
    defaultMessage: 'want to get an account?',
  },
  staySigned: {
    id: 'app.login.container.stay_signed',
    description: 'Stay signed message',
    defaultMessage: 'Stay signed-in for 2 weeks',
  },
});

class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    return (
      <section className="LoginPage">
        <header className="LoginPage-header">
          <div className="LoginPage-headerHome">
            <a>
              <FormattedMessage {...msgs.home} />
            </a>
          </div>
          <figure className="LoginPage-headerLogo">
            <img src={logo} alt="logo unidesq" />
          </figure>
          <div className="LoginPage-headerGetAccount">
            <a>
              <FormattedMessage {...msgs.getAccount} />
            </a>
          </div>
        </header>
        <main className="LoginPage-container">
          <section className="Login">
            <header className="Login-message">
              <FormattedMessage {...msgs.welcome} />
            </header>
            <div className="Login-box">
              <Input type="text" className="Login-input" valid="asdasd" placeholder="Your email address" />
              <Input type="password" className="Login-input" valid="asdasd" placeholder="Your password" behaviour="password" />
              <Checkbox
                className="Login-input Login-input--checkbox"
                labelText={formatMessage(msgs.staySigned)}
              />
              <Button buttonType="large" expanded>Log in</Button>
            </div>
          </section>
        </main>
      </section>
    );
  }
}

LoginPage.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(LoginPage);
