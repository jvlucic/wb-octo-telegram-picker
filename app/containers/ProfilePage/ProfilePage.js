import React from 'react';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';

export default function ProfilePage() {
  return (
    <div className="ProfilePage">
      <ProfileForm />
      <ChangePasswordForm />
    </div>
  );
}
