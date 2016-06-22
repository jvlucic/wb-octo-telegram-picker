import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import FormGroupAccount from './FormGroupAccount';
import Input from 'components/Input';
import Button from 'components/Button';
import uniqueId from 'utils/uniqueId';
import { selectUser } from 'auth/selectors';
import './styles.scss';

const msgs = defineMessages({
  button: {
    id: 'app.secure.account.form_profile.label.button',
    description: 'Button submit of profile form',
    defaultMessage: 'Update',
  },
  labelUsername: {
    id: 'app.secure.account.form_profile.label.username',
    description: 'Label for username field',
    defaultMessage: 'Username',
  },
  labelFirstName: {
    id: 'app.secure.account.form_profile.label.first_name',
    description: 'Label for firstname field',
    defaultMessage: 'First name',
  },
  labelLastName: {
    id: 'app.secure.account.form_profile.label.last_name',
    description: 'Label for lastname field',
    defaultMessage: 'Last name',
  },
  labelEmail: {
    id: 'app.secure.account.form_profile.label.email_address',
    description: 'Label for email address',
    defaultMessage: 'E-mail address',
  },
  labelCompanyName: {
    id: 'app.secure.account.form_profile.label.company_name',
    description: 'Label for company name field',
    defaultMessage: 'Company name',
  },
  labelPhoneNumber: {
    id: 'app.secure.account.form_profile.label.phone_number',
    description: 'Label for phone Number field',
    defaultMessage: 'Phone number',
  },
});

const fields = ['username', 'firstName', 'lastName', 'email', 'companyName', 'phoneNumber'];

function validate(values) {
  const errors = {};

  if (!values.username) {
    errors.username = 'Username is required';
  }

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  }

  return errors;
}

class ProfileForm extends Component {
  constructor(props) {
    super(props);

    // Binding this to methods
    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
    this.ids = {
      username: uniqueId('username'),
      firstName: uniqueId('firstName'),
      lastName: uniqueId('lastName'),
      email: uniqueId('email'),
      companyName: uniqueId('companyName'),
      phoneNumber: uniqueId('phoneNumber'),
    };
  }

  handleProfileSubmit(values) {
    console.log(values);
  }

  render() {
    const {
      intl: { formatMessage } = {},
      fields: {
        username,
        firstName,
        lastName,
        email,
        companyName,
        phoneNumber,
      } = {},
      handleSubmit,
    } = this.props;
    return (
      <form className="AccountPage-formProfile" onSubmit={handleSubmit(this.handleProfileSubmit)}>
        <FormGroupAccount
          htmlFor={this.ids.username}
          labelText={formatMessage(msgs.labelUsername)}
          {...username}
        >
          <Input
            type="text"
            id={this.ids.username}
            placeholder={formatMessage(msgs.labelUsername)}
            {...username}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.firstName}
          labelText={formatMessage(msgs.labelFirstName)}
          {...firstName}
        >
          <Input
            id={this.ids.firstName}
            type="text"
            placeholder={formatMessage(msgs.labelFirstName)}
            {...firstName}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.lastName}
          labelText={formatMessage(msgs.labelLastName)}
          {...lastName}
        >
          <Input
            type="text"
            id={this.ids.lastName}
            placeholder={formatMessage(msgs.labelLastName)}
            {...lastName}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.email}
          labelText={formatMessage(msgs.labelEmail)}
          {...email}
        >
          <Input
            id={this.ids.email}
            type="text"
            placeholder={formatMessage(msgs.labelEmail)}
            {...email}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.companyName}
          labelText={formatMessage(msgs.labelCompanyName)}
          {...companyName}
        >
          <Input
            id={this.ids.companyName}
            type="text"
            placeholder={formatMessage(msgs.labelCompanyName)}
            {...companyName}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.phoneNumber}
          labelText={formatMessage(msgs.labelPhoneNumber)}
          {...phoneNumber}
        >
          <Input
            id={this.ids.phoneNumber}
            type="text"
            placeholder={formatMessage(msgs.labelPhoneNumber)}
            {...phoneNumber}
          />
        </FormGroupAccount>
        <Button
          type="submit"
          className="AccountPage-profileButton"
          buttonType="large"
        >
          <FormattedMessage {...msgs.button} />
        </Button>
      </form>
    );
  }
}

ProfileForm.propTypes = {
  intl: PropTypes.object,
  fields: PropTypes.shape({
    username: PropTypes.object,
    firstName: PropTypes.object,
    lastName: PropTypes.object,
    email: PropTypes.object,
    companyName: PropTypes.object,
    phoneNumber: PropTypes.object,
  }),
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'profile',
  fields,
  validate,
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint).toJS(),
}, createSelector(
  selectUser,
  user => ({
    initialValues: {
      username: user && user.get('username') || '',
      firstName: user && user.get('firstName') || '',
      lastName: user && user.get('lastName') || '',
      email: user && user.get('email') || '',
    },
  })))(injectIntl(ProfileForm));
