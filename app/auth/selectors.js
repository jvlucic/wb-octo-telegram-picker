import { createSelector } from 'reselect';

const selectAuth = (state) => state.get('auth');

export const selectUsername = createSelector(
  selectAuth,
  (auth) => auth.get('username'),
);

export const selectIsLogged = createSelector(
  selectAuth,
  (auth) => auth.get('logged'),
);

export const selectError = createSelector(
  selectAuth,
  (auth) => auth.get('error'),
);
