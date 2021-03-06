import React, { PropTypes } from 'react';
import './styles.scss';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { UnidesqLogoIcon } from 'theme/assets';
import { selectFullName } from 'auth/selectors';
import { logout } from 'auth/actions';

const msgs = defineMessages({
  dashboard: {
    id: 'app.secure.header.nav.dashboard',
    description: 'Dashboard link',
    defaultMessage: 'Dashboard',
  },
  reporting: {
    id: 'app.secure.header.nav.reporting',
    description: 'Reporting link',
    defaultMessage: 'Reporting',
  },
  creatives: {
    id: 'app.secure.header.nav.creatives',
    description: 'Creatives link',
    defaultMessage: 'Creatives',
  },
  tools: {
    id: 'app.secure.header.nav.tools',
    description: 'Tools link',
    defaultMessage: 'Tools',
  },
  account: {
    id: 'app.secure.header.nav.account',
    description: 'Account link',
    defaultMessage: 'Account',
  },
  signout: {
    id: 'app.secure.header.nav.signout',
    description: 'Log Out link',
    defaultMessage: 'Log out',
  },
  needHelp: {
    id: 'app.secure.header.nav.needHelp',
    description: 'Need Help? link',
    defaultMessage: 'Need Help?',
  },
  welcome: {
    id: 'app.secure.header.welcome',
    description: 'Welcome message in header',
    defaultMessage: 'Welcome, {name}',
  },
});

function SecureHeader({ fullName, logout: logoutAction }) {
  return (
    <header className="SecureHeader" role="banner" >
      <div className="SecureHeader-wrapper">
        <aside className="SecureHeader-logo">
          <Link to="/">
            <UnidesqLogoIcon className="SecureHeader-logoIcon" />
          </Link>
        </aside>
        <nav role="navigation" className="SecureHeader-nav">
          <ul className="SecureHeader-menu">
            <li className="SecureHeader-navLink">
              <Link to="/" activeClassName="is-active">
                <FormattedMessage {...msgs.dashboard} />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="SecureHeader-account">
          <div className="SecureHeader-accountWelcome">
            <FormattedMessage {...msgs.welcome} values={{ name: fullName }} />
            <a href="mailto:support@unidesq.com" className="SecureHeader-accountHelp">
              <FormattedMessage {...msgs.needHelp} />
            </a>
          </div>
          <div className="SecureHeader-accountMenu">
            <Link to="/account" activeClassName="is-active">
              <FormattedMessage {...msgs.account} />
            </Link>
            <a onClick={logoutAction} >
              <FormattedMessage {...msgs.signout} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

SecureHeader.propTypes = {
  fullName: PropTypes.string,
  logout: PropTypes.func,
};

export default connect(createStructuredSelector({
  fullName: selectFullName,
}), {
  logout,
})(SecureHeader);
