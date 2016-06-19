/*
 * ForgotPage
 *
 * Authentication page
 *
 */
import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Input from 'components/Input';
import Button from 'components/Button';
import { Link, withRouter } from 'react-router';
import { AlertSuccessIcon } from 'theme/assets';
import './styles.scss';

const msgs = defineMessages({
  label: {
    id: 'app.login_app.forgot.container.message',
    description: 'Message for forgot password',
    defaultMessage: 'Enter your email address or nickname associated with your account.',
  },
  messageOk: {
    id: 'app.login_app.forgot.container.message_ok',
    description: 'Ok message when the user submit the forgot form',
    defaultMessage: 'If the email is in our database, then we will send you an email to set a new password.',
  },
  emailAddress: {
    id: 'app.login_app.forgot.container.email_address',
    description: 'Placeholder for input email address',
    defaultMessage: 'Your email address',
  },
  recoverPassword: {
    id: 'app.login_app.forgot.container.recover_password',
    description: 'Recover password button text',
    defaultMessage: 'Recover password',
  },
  havingProblem: {
    id: 'app.login_app.forgot.container.having_problem',
    description: 'Text for having problem question',
    defaultMessage: 'Are you having a problem?',
  },
  contactSupport: {
    id: 'app.login_app.forgot.container.contact_support',
    description: 'Text for contact support link',
    defaultMessage: 'Contact support',
  },
  goHome: {
    id: 'app.login_app.forgot.container.go_home',
    description: 'Go to home message button',
    defaultMessage: 'Go to Home',
  },
});

/**
 * Page that the user goes then need reset the password
 */
class ForgotPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  /**
   * constructor
   */
  constructor(props) {
    super(props);

    // Binding this to function
    this.handleOnResetPasswordClick = this.handleOnResetPasswordClick.bind(this);
    this.handleOnGoHomeClick = this.handleOnGoHomeClick.bind(this);

    this.state = {
      wasSended: false,
    };
  }

  handleOnResetPasswordClick() {
    this.setState({ wasSended: true });
  }

  handleOnGoHomeClick() {
    this.props.router.push('/');
  }

  render() {
    const { intl: { formatMessage } = {} } = this.props;

    if (this.state.wasSended) {
      return (
        <section className="Forgot">
          <div className="Forgot-icon">
            <AlertSuccessIcon className="Forgot-okIcon" />
          </div>
          <div className="Forgot-message Forgot-message--ok">
            <FormattedMessage {...msgs.messageOk} />
          </div>
          <div className="Forgot-goHome">
            <Button
              className="Forgot-button"
              buttonType="large"
              onClick={this.handleOnGoHomeClick}
              expanded
            >
              <FormattedMessage {...msgs.goHome} />
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="Forgot">
        <header className="Forgot-message">
          <FormattedMessage {...msgs.label} />
        </header>
        <div className="Forgot-box">
          <Input type="text" className="Forgot-input" placeholder={formatMessage(msgs.emailAddress)} />
          <Button
            className="Forgot-button"
            buttonType="large"
            onClick={this.handleOnResetPasswordClick}
            expanded
          >
            <FormattedMessage {...msgs.recoverPassword} />
          </Button>
          <div className="Forgot-havingProblem">
            <FormattedMessage {...msgs.havingProblem} />
            <Link to="/contact" className="Forgot-contactSupport">
              <FormattedMessage {...msgs.contactSupport} />
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

ForgotPage.propTypes = {
  intl: PropTypes.object,
  router: PropTypes.object,
};

export default injectIntl(withRouter(ForgotPage));
