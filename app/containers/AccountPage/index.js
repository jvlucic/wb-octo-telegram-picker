/*
 * Account Page
 *
 * Account Parent Page
 *
 */

import React, { Component, PropTypes } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
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
            <div className="AccountPage-overviewNav">
              <div className="AccountPage-overviewNavItem">
                <Link to="/account" activeClassName="is-active">
                  Profile
                </Link>
              </div>
              <div className="AccountPage-overviewNavItem">
                <Link to="/account/company" activeClassName="is-active">
                  Company
                </Link>
              </div>
              <div className="AccountPage-overviewNavItem">
                <Link to="/account/brand" activeClassName="is-active">
                  Brand
                </Link>
              </div>
            </div>
          </div>
          <div className="AccountPage-childContent">
            {this.props.children}
          </div>
        </div>
      </section>
    );
  }
}

AccountPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AccountPage;
