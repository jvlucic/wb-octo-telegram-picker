import React from 'react';
import logo from './unidesq-logo.png';
import './styles.scss';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
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

export default function SecureHeader() {
  return (
    <header className="SecureHeader">
      <div className="SecureHeader-wrapper">
        <aside className="SecureHeader-logo">
          <img src={logo} alt="Unidesq Logo" />
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
            <FormattedMessage {...msgs.welcome} values={{ name: 'John Doe' }} />
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
