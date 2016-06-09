// Contains utils to download the locale data for the current language, eventually
// requiring the `Intl` polyfill for browser not supporting it
// It is used in client.js *before* rendering the root component.

import { addLocaleData } from 'react-intl';

import areIntlLocalesSupported from 'intl-locales-supported';

/**
 * Load the intl polyfill if is needed;
 * @param  {string} locale  - Language to test the locale support
 * @return {Promise}        - Promise resolving if the polyfill was loaded
 */
export function loadPolyfill(locale) {
  if (global.Intl && areIntlLocalesSupported(locale)) {
    // all fine: Intl is in the global scope and the locale data is available
    return Promise.resolve();
  }

  return System.import('intl');
}

/**
 * [loadLocaleData description]
 * @param  {[type]} locale [description]
 * @return {[type]}        [description]
 */
export function loadLocaleData(locale) {
  switch (locale) {
    // spanish
    case 'es': {
      const localeData = System.import('react-intl/locale-data/es').then(addLocaleData);

      if (!areIntlLocalesSupported('es')) {
        const loadModules = [
          System.import('intl/locale-data/jsonp/es'),
          localeData,
        ];
        return Promise.all(loadModules);
      }

      return localeData;
    }
    // english
    default: {
      if (!areIntlLocalesSupported('en')) {
        return System.import('intl/locale-data/jsonp/en');
      }
      return Promise.resolve;
    }
  }
}

/**
 * [loadPolyfillAndData description]
 * @param  {[type]} locale [description]
 * @return {[type]}        [description]
 */
export function loadPolyfillAndData(locale) {
  return loadPolyfill(locale)
          .then(() => loadLocaleData(locale));
}
