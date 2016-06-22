import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import FormGroupAccount from './FormGroupAccount';
import Input from 'components/Input';
import Button from 'components/Button';
import uniqueId from 'utils/uniqueId';
import './styles.scss';

const msgs = defineMessages({
  button: {
    id: 'app.secure.account.form_change_password.label.button',
    description: 'Button submit of profile form',
    defaultMessage: 'Save new password',
  },
  labelCurrentPassword: {
    id: 'app.secure.account.form_change_password.label.current_password',
    description: 'Label for verify current password field',
    defaultMessage: 'Verify current password',
  },
  labelNewPassword: {
    id: 'app.secure.account.form_change_password.label.new_password',
    description: 'Label for new password field',
    defaultMessage: 'New password',
  },
  labelVerifyNewPasword: {
    id: 'app.secure.account.form_change_password.label.verify_new_password',
    description: 'Label for verify new password',
    defaultMessage: 'Verify new password',
  },
});

const fields = ['currentPassword', 'newPassword', 'verifyNewPassword'];

function validate(values) {
  const errors = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  }

  if (!values.verifyNewPassword || values.verifyNewPassword !== values.newPassword) {
    errors.verifyNewPassword = 'Must be equal to the new password';
  }

  return errors;
}

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);

    // Binding this to methods
    this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(this);
    this.ids = {
      currentPassword: uniqueId('currentPassword'),
      newPassword: uniqueId('newPassword'),
      verifyNewPassword: uniqueId('verifyNewPassword'),
    };
  }

  handleChangePasswordSubmit(values) {
    console.log(values);
  }

  render() {
    const {
      intl: { formatMessage } = {},
      fields: {
        currentPassword,
        newPassword,
        verifyNewPassword,
      } = {},
      handleSubmit,
      valid,
    } = this.props;
    return (
      <form className="AccountPage-formChangePassword" onSubmit={handleSubmit(this.handleChangePasswordSubmit)}>
        <FormGroupAccount
          htmlFor={this.ids.currentPassword}
          labelText={formatMessage(msgs.labelCurrentPassword)}
          {...currentPassword}
        >
          <Input
            id={this.ids.currentPassword}
            type="password"
            placeholder={formatMessage(msgs.labelCurrentPassword)}
            {...currentPassword}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.newPassword}
          labelText={formatMessage(msgs.labelNewPassword)}
          {...newPassword}
        >
          <Input
            id={this.ids.newPassword}
            type="password"
            placeholder={formatMessage(msgs.labelNewPassword)}
            {...newPassword}
          />
        </FormGroupAccount>
        <FormGroupAccount
          htmlFor={this.ids.verifyNewPassword}
          labelText={formatMessage(msgs.labelVerifyNewPasword)}
          {...verifyNewPassword}
        >
          <Input
            type="password"
            id={this.ids.verifyNewPassword}
            placeholder={formatMessage(msgs.labelVerifyNewPasword)}
            {...verifyNewPassword}
          />
        </FormGroupAccount>
        <Button

          className="AccountPage-changePasswordButton"
          buttonType="large"
          disabled={!valid}
        >
          <FormattedMessage {...msgs.button} />
        </Button>
      </form>
    );
  }
}

ChangePasswordForm.propTypes = {
  intl: PropTypes.object,
  fields: PropTypes.shape({
    currentPassword: PropTypes.object,
    newPassword: PropTypes.object,
    verifyNewPassword: PropTypes.object,
  }),
  valid: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'change_password',
  fields,
  validate,
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint).toJS(),
})(injectIntl(ChangePasswordForm));
