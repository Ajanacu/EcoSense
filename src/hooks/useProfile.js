import { useState, useEffect } from 'react';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ecosense_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const saveProfile = (newProfile) => {
    localStorage.setItem('ecosense_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const clearProfile = () => {
    localStorage.removeItem('ecosense_profile');
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile };
}
