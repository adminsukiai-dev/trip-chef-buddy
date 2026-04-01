import { useState } from 'react';

const STORAGE_KEY = 'gg_dietary_profile';

interface DietaryProfile {
  allergens: string[];
  familyAllergens: string[];
  dietaryPreferences: string[];
}

export const useUserDietaryProfile = () => {
  const [profile] = useState<DietaryProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { allergens: [], familyAllergens: [], dietaryPreferences: [] };
  });

  return {
    allergens: profile.allergens,
    familyAllergens: profile.familyAllergens,
    dietaryPreferences: profile.dietaryPreferences,
  };
};
