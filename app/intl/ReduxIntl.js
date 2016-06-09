import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import formats from './formats';
import { createStructuredSelector } from 'reselect';
import { selectLocale, selectMessages } from './selectors';

class ReduxIntl extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { locale, messages } = this.props;
    return (
      <IntlProvider formats={formats} locale={locale} messages={messages}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

ReduxIntl.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired,
  children: PropTypes.node,
};


const mapStateToProps = createStructuredSelector({
  locale: selectLocale(),
  messages: selectMessages(),
});

export default connect(mapStateToProps)(ReduxIntl);
