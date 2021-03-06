// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getHooks } from 'utils/hooks';
import { selectIsLogged } from 'auth/selectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

function requireAuth(store) {
  return (nextState, replace) => {
    // if (!selectIsLogged(store.getState())) {
    //  replace('login');
    // }
  };
}

export default function createRoutes(store) {
  // Create reusable async injectors using getHooks factory
  const { injectReducer } = getHooks(store);
  const secureRoute = requireAuth(store);
  return [
    {
      name: 'secure',
      onEnter: secureRoute,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/SecureApp'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: '/',
          name: 'home',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/DashboardPage/DashboardPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          name: 'account',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/AccountPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
          childRoutes: [
            {
              path: '/account',
              name: 'profile',
              getComponent(nextState, cb) {
                console.log('was called');
                const importModules = Promise.all([
                  System.import('containers/ProfilePage/reducer'),
                  System.import('containers/ProfilePage/ProfilePage'),
                ]);

                const renderRoute = loadModule(cb);

                importModules.then(([reducer, component]) => {
                  injectReducer('profile', reducer.default);
                  renderRoute(component);
                });

                importModules.catch(errorLoading);
              },
            },
          ],
        },
        {
          path: '/creatives',
          name: 'creatives',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/CreativesPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/reporting',
          name: 'reporting',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/ReportingPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/tools',
          name: 'tools',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/ToolsPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      name: 'loginApp',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/LoginApp'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: '/login',
          name: 'login',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/LoginPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/forgot',
          name: 'forgot',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              System.import('containers/ForgotPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component]) => {
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
