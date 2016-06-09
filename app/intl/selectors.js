import { createSelector } from 'reselect';

const selectIntl = () => (state) => state.get('intl');

export const selectLocale = () => createSelector(
  selectIntl(),
  (intl) => intl.get('locale'),
);

export const selectMessages = () => createSelector(
  selectIntl(),
  (intl) => intl.get('messages'),
);
