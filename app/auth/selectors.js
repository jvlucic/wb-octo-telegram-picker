import { createSelector } from 'reselect';

const selectAuth = (state) => state.get('auth');

export const selectUser = createSelector(
  selectAuth,
  (auth) => auth.get('user'),
);

export const selectToken = createSelector(
  selectAuth,
  (auth) => auth && auth.get('accessToken'),
);

export const selectUsername = createSelector(
  selectUser,
  user => user && user.get('username'),
);

export const selectUserId = createSelector(
  selectUser,
  user => user && user.get('id'),
);

export const selectFirstName = createSelector(
  selectUser,
  user => user && user.get('firstName'),
);

export const selectLastName = createSelector(
  selectUser,
  user => user && user.get('lastName'),
);

export const selectFullName = createSelector(
  selectFirstName,
  selectLastName,
  (firstName, lastName) => `${firstName} ${lastName}`,
);

export const selectIsLogged = createSelector(
  selectAuth,
  (auth) => auth.get('logged'),
);

export const selectLoggingIn = createSelector(
  selectAuth,
  (auth) => auth.get('loggingIn'),
);

export const selectError = createSelector(
  selectAuth,
  (auth) => auth.get('error'),
);
