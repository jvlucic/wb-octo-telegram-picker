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
import { Link } from 'react-router';
import './styles.scss';

const msgs = defineMessages({
  welcome: {
    id: 'app.login_app.login.container.message',
    description: 'Welcome message in login box',
    defaultMessage: 'Welcome back. Please log in.',
  },
  staySigned: {
    id: 'app.login_app.login.container.stay_signed',
    description: 'Stay signed message',
    defaultMessage: 'Stay signed-in for 2 weeks',
  },
  forgot: {
    id: 'app.login_app.login.container.forgot',
    description: 'Text for forgot password link',
    defaultMessage: 'Forgot password?',
  },
});

class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    return (
      <section className="Login">
        <header className="Login-message">
          <FormattedMessage {...msgs.welcome} />
        </header>
        <div className="Login-box">
          <Input type="text" className="Login-input" placeholder="Your email address" />
          <Input type="password" className="Login-input" placeholder="Your password" behaviour="password" />
          <Checkbox
            className="Login-input Login-input--checkbox"
            labelText={formatMessage(msgs.staySigned)}
          />
          <Button className="Login-button" buttonType="large" expanded>Log in</Button>
          <div className="Login-forgot">
            <Link to="/forgot" className="Login-forgotLink">
              <FormattedMessage {...msgs.forgot} />
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

LoginPage.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(LoginPage);
