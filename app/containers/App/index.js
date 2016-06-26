/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styles from './styles.scss';
import './Toaster.scss'; // only needs to be imported once
import './ToasterAnimate.scss'; // only needs to be imported once
import { ToastContainer, ToastMessage } from 'react-toastr';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

export default class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    children: React.PropTypes.node,
  };

  constructor(props, context) {
    super(props, context);
    this.addAlert = this.addAlert.bind(this);
  }

  addAlert(type, message, title) {
    if (this.refs.container) {
      this.refs.container[type](message, title, {
        closeButton: true,
        timeOut: 2000,
        preventDuplicates: false,
      });
    }
  }

  render() {
    return (
      <div ref="app" id="appComponentContainer" className={`${styles.tmp}`}>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
        {this.props.children && React.cloneElement(this.props.children, { addAlert: this.addAlert })}
      </div>
    );
  }
}
