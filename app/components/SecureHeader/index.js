import React, { PropTypes } from 'react';
import logo from './unidesq-logo.png';
import './styles.scss';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectFullName } from 'auth/selectors';

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

function SecureHeader({ fullName }) {
  return (
    <header className="SecureHeader" role="banner" >
      <div className="SecureHeader-wrapper">
        <aside className="SecureHeader-logo">
          <Link to="/">
            <img src={logo} alt="Unidesq Logo" />
          </Link>
        </aside>
        <nav role="navigation" className="SecureHeader-nav">
          <ul className="SecureHeader-menu">
            <li className="SecureHeader-navLink">
              <Link to="/" activeClassName="is-active">
                <FormattedMessage {...msgs.dashboard} />
              </Link>
            </li>
            <li className="SecureHeader-navLink">
              <Link to="/reporting" activeClassName="is-active">
                <FormattedMessage {...msgs.reporting} />
              </Link>
            </li>
            <li className="SecureHeader-navLink">
              <Link to="/creatives" activeClassName="is-active">
                <FormattedMessage {...msgs.creatives} />
              </Link>
            </li>
            <li className="SecureHeader-navLink">
              <Link to="/tools" activeClassName="is-active">
                <FormattedMessage {...msgs.tools} />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="SecureHeader-account">
          <div className="SecureHeader-accountWelcome">
            <FormattedMessage {...msgs.welcome} values={{ name: fullName }} />
            <a className="SecureHeader-accountHelp">
              <FormattedMessage {...msgs.needHelp} />
            </a>
          </div>
          <div className="SecureHeader-accountMenu">
            <Link to="/account" activeClassName="is-active">
              <FormattedMessage {...msgs.account} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

SecureHeader.propTypes = {
  fullName: PropTypes.string,
};

export default connect(createStructuredSelector({
  fullName: selectFullName,
}))(SecureHeader);
