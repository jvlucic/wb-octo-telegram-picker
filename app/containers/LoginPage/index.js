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
import FormGroup from 'components/FormGroup';
import { reduxForm } from 'redux-form';
import { Link, withRouter } from 'react-router';
import uniqueId from 'utils/uniqueId';
import { authenticate } from 'auth/actions';
import { selectIsLogged, selectError } from 'auth/selectors';
import { createStructuredSelector } from 'reselect';
import classnames from 'classnames';
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

export const fields = ['username', 'password'];

export const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Email is required.';
  }

  if (!values.password) {
    errors.password = 'Invalid password.';
  }

  return errors;
};

class LoginPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    // Ids for inputs
    this.ids = {
      username: uniqueId('username'),
      password: uniqueId('password'),
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.isLogged !== newProps.isLogged && newProps.isLogged === true) {
      this.props.router.push('/');
    }
  }

  handleFormSubmit({ username, password }, dispatch) {
    return dispatch(authenticate(username, password));
  }

  render() {
    const {
      intl: { formatMessage } = {},
      fields: { username, password } = {},
      handleSubmit,
      authError,
    } = this.props;

    const stateClass = classnames({
      'has-error': !!authError,
    });

    return (
      <form className="Login" onSubmit={handleSubmit(this.handleFormSubmit)}>
        <header className="Login-message">
          <FormattedMessage {...msgs.welcome} />
        </header>
        <div className="Login-box">
          <div className={classnames('Login-error', stateClass)}>
            <span>{authError}</span>
          </div>
          <FormGroup
            htmlFor={this.ids.username}
            className="Login-formGroup"
            {...username}
          >
            <Input
              id={this.ids.username}
              type="text"
              className="Login-input"
              placeholder="Your email address"
              {...username}
            />
          </FormGroup>
          <FormGroup
            htmlFor={this.ids.password}
            className="Login-formGroup"
            {...password}
          >
            <Input
              id={this.ids.password}
              type="password"
              className="Login-input"
              placeholder="Your password"
              {...password}
            />
          </FormGroup>
          <Checkbox
            className="Login-input Login-input--checkbox"
            labelText={formatMessage(msgs.staySigned)}
          />
          <Button
            type="submit"
            className="Login-button"
            buttonType="large"
            expanded
          >
            Log in
          </Button>
          <div className="Login-forgot">
            <Link to="/forgot" className="Login-forgotLink">
              <FormattedMessage {...msgs.forgot} />
            </Link>
          </div>
        </div>
      </form>
    );
  }
}

LoginPage.propTypes = {
  intl: PropTypes.object,
  fields: PropTypes.shape({
    username: PropTypes.object,
    password: PropTypes.object,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLogged: PropTypes.bool,
  authError: PropTypes.any,
  router: PropTypes.object,
};

export default reduxForm({
  form: 'login',
  fields,
  validate,
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint).toJS(),
}, createStructuredSelector({
  isLogged: selectIsLogged,
  authError: selectError,
}))(injectIntl(withRouter(LoginPage)));
