/*
 * LoginPage
 *
 * Authentication page
 *
 */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
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
});

class AccountPage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
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
            <ProfileForm />
            <ChangePasswordForm />
          </div>
        </div>
      </section>
    );
  }
}

AccountPage.propTypes = {
};

export default AccountPage;
