import { createSelector } from 'reselect';

const selectAuth = (state) => state.get('auth');

export const selectUser = createSelector(
  selectAuth,
  (auth) => auth.get('user'),
);

export const selectUsername = createSelector(
  selectUser,
  user => user.get('username'),
);

export const selectFirstName = createSelector(
  selectUser,
  user => user.get('firstName'),
);

export const selectLastName = createSelector(
  selectUser,
  user => user.get('lastName'),
);

export const selectComposeName = createSelector(
  selectFirstName,
  selectLastName,
  (firstName, lastName) => `${firstName} ${lastName}`,
);

export const selectIsLogged = createSelector(
  selectAuth,
  (auth) => auth.get('logged'),
);

export const selectError = createSelector(
  selectAuth,
  (auth) => auth.get('error'),
);
