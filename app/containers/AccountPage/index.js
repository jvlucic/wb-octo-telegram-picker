/*
 * LoginPage
 *
 * Authentication page
 *
 */

import React, { PropTypes } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import uniqueId from 'utils/uniqueId';
import classnames from 'classnames';
import './styles.scss';

const msgs = defineMessages({
  account: {
    id: 'app.secure.account.header.account',
    description: 'Account header message',
    defaultMessage: 'Account',
  },
  overview: {
    id: 'overview',
    description: 'overview',
    defaultMessage: 'Overview',
  },
  labelUsername: {
    id: 'app.secure.account.form.label.username',
    description: 'Label for username field',
    defaultMessage: 'Username',
  },
  labelFirstName: {
    id: 'app.secure.account.form.label.first_name',
    description: 'Label for firstname field',
    defaultMessage: 'First name',
  },
  labelLastName: {
    id: 'app.secure.account.form.label.last_name',
    description: 'Label for lastname field',
    defaultMessage: 'Last name',
  },
  labelEmailAddress: {
    id: 'app.secure.account.form.label.email_address',
    description: 'Label for email address',
    defaultMessage: 'E-mail address',
  },
  labelCompanyName: {
    id: 'app.secure.account.form.label.company_name',
    description: 'Label for company name field',
    defaultMessage: 'Company name',
  },
  labelPhoneNumber: {
    id: 'app.secure.account.form.label.phone_number',
    description: 'Label for phone Number field',
    defaultMessage: 'Phone number',
  },
  labelCurrentPassword: {
    id: 'app.secure.account.form.label.current_password',
    description: 'Label for verify current password field',
    defaultMessage: 'Verify current password',
  },
  labelNewPassword: {
    id: 'app.secure.account.form.label.new_password',
    description: 'Label for new password field',
    defaultMessage: 'New password',
  },
  labelVerifyNewPasword: {
    id: 'app.secure.account.form.label.verify_new_password',
    description: 'Label for verify new password',
    defaultMessage: 'Verify new password',
  },
});

function FormGroupAccount({ className, children, ...props }) {
  return (
    <FormGroup {...props} className={classnames('AccountPage-formGroup', className)}>
      {children}
    </FormGroup>
  );
}

FormGroupAccount.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

class AccountPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);


    this.ids = {
      username: uniqueId('username'),
      firstName: uniqueId('firstName'),
      lastName: uniqueId('lastName'),
      emailAddress: uniqueId('emailAddress'),
      companyName: uniqueId('companyName'),
      phoneNumber: uniqueId('phoneNumber'),
      currentPassword: uniqueId('currentPassword'),
      newPassword: uniqueId('newPassword'),
      verifyNewPassword: uniqueId('verifyNewPassword'),
    };
  }
  render() {
    const { intl: { formatMessage } = { } } = this.props;

    return (
      <section className="AccountPage">
        <header className="AccountPage-header">
          <FormattedMessage {...msgs.account} />
        </header>
        <div className="AccountPage-content">
          <div className="AccountPage-overview">
            <header className="AccountPage-overviewHeader">
              <FormattedMessage {...msgs.overview} />
            </header>
          </div>
          <div className="AccountPage-form">
            <form className="AccountPage-formProfile">
              <FormGroupAccount
                htmlFor={this.ids.username}
                labelText={formatMessage(msgs.labelUsername)}
              >
                <Input type="text" id={this.ids.username} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.firstName}
                labelText={formatMessage(msgs.labelFirstName)}
              >
                <Input type="text" id={this.ids.firstName} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.lastName}
                labelText={formatMessage(msgs.labelLastName)}
              >
                <Input type="text" id={this.ids.lastName} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.emailAddress}
                labelText={formatMessage(msgs.labelEmailAddress)}
              >
                <Input type="text" id={this.ids.emailAddress} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.companyName}
                labelText={formatMessage(msgs.labelCompanyName)}
              >
                <Input type="text" id={this.ids.companyName} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.phoneNumber}
                labelText={formatMessage(msgs.labelPhoneNumber)}
              >
                <Input type="text" id={this.ids.phoneNumber} />
              </FormGroupAccount>
              <Button className="AccountPage-profileButton" buttonType="large">
                Update
              </Button>
            </form>
            <form className="AccountPage-formChangePassword">
              <FormGroupAccount
                htmlFor={this.ids.currentPassword}
                labelText={formatMessage(msgs.labelCurrentPassword)}
              >
                <Input type="password" id={this.ids.usecurrentPasswordrname} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.newPassword}
                labelText={formatMessage(msgs.labelNewPassword)}
              >
                <Input type="password" id={this.ids.newPassword} />
              </FormGroupAccount>
              <FormGroupAccount
                htmlFor={this.ids.verifyNewPassword}
                labelText={formatMessage(msgs.labelVerifyNewPasword)}
              >
                <Input type="password" id={this.ids.verifyNewPassword} />
              </FormGroupAccount>
              <Button className="AccountPage-changePasswordButton" buttonType="large" disabled>
                Save new password
              </Button>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

AccountPage.propTypes = {
  intl: PropTypes.object,
};

export default injectIntl(AccountPage);
