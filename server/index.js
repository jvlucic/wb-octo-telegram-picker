/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');
const ngrok = require('ngrok');
const request = require('request');
const isDev = process.env.NODE_ENV !== 'production';

const config = isDev ? require('../config/config.dev') : require('../config/config.prod');

const frontend = require('./middlewares/frontendMiddleware');

const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use('/api', (req, res) => {
  req.pipe(request(config.apiUrl + req.url)).pipe(res);
});

// Initialize frontend middleware that will serve your JS app
const webpackConfig = isDev
  ? require('../internals/webpack/webpack.dev.babel')
  : require('../internals/webpack/webpack.prod.babel');

app.use(frontend(webpackConfig));

const port = process.env.PORT || 3000;

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err);
  }

  // Connect to ngrok in dev mode
  if (isDev) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, url);
    });
  } else {
    logger.appStarted(port);
  }
});
