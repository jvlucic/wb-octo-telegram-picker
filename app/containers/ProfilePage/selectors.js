import { createSelector } from 'reselect';

const selectProfile = (state) => state.get('profile');

export const selectUpdatingUser = createSelector(
  selectProfile,
  (profile) => profile.get('updatingUser'),
);

export const selectUpdateUserError = createSelector(
  selectProfile,
  (profile) => profile.get('updateUserError'),
);

export const selectChangingPassword = createSelector(
  selectProfile,
  (profile) => profile.get('changingPassword'),
);

export const selectChangePasswordError = createSelector(
  selectProfile,
  (profile) => profile.get('changePasswordError'),
);
