/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'babel-polyfill';

// TODO constrain eslint import/no-unresolved rule to this block
// Load the manifest.json file and the .htaccess file
import 'file?name=[name].[ext]!./manifest.json';  // eslint-disable-line import/no-unresolved
import 'file?name=[name].[ext]!./.htaccess';      // eslint-disable-line import/no-unresolved

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'react-router-scroll';
import configureStore from './store';
import { loadPolyfillAndData } from 'intl/intUtils';
import ReduxIntl from 'intl/ReduxIntl';
import { logginInSuccess, getUserInfo } from 'auth/actions';
import constants from '../app/constants';
// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/lib/sanitize.css';
import 'containers/App/styles.scss';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
import { selectLocationState } from 'containers/App/selectors';
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: selectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
import App from 'containers/App';
import createRoutes from './routes';
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};
const logginInData = localStorage.getItem('logginInSuccess');
let gettingUser = Promise.resolve();
if (logginInData) {
  store.dispatch(logginInSuccess(JSON.parse(logginInData)));
  gettingUser = store.dispatch(getUserInfo());
}

gettingUser
  .then(
    () => loadPolyfillAndData(constants.FALLBACK_LOCALE),
    () => loadPolyfillAndData(constants.FALLBACK_LOCALE),
  )
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <ReduxIntl>
          <Router
            history={history}
            routes={rootRoute}
            render={
              // Scroll to top when going to a new page, imitating default browser
              // behaviour
              applyRouterMiddleware(
                useScroll(
                  (prevProps, props) => {
                    if (!prevProps || !props) {
                      return true;
                    }

                    if (prevProps.location.pathname !== props.location.pathname) {
                      return [0, 0];
                    }

                    return true;
                  }
                )
              )
            }
          />
        </ReduxIntl>
      </Provider>,
      document.getElementById('app')
    );
  });
