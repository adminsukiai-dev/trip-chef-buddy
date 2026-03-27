import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserDietaryProfile {
  dietaryPreferences: string[];
  allergens: string[];
  familyAllergens: string[];
  loading: boolean;
}

export const useUserDietaryProfile = (): UserDietaryProfile => {
  const { user } = useAuth();
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [familyAllergens, setFamilyAllergens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDietaryPreferences([]);
      setAllergens([]);
      setFamilyAllergens([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('dietary_preferences, allergens, family_members')
        .eq('id', user.id)
        .single();

      if (data) {
        setDietaryPreferences(data.dietary_preferences ?? []);
        setAllergens(data.allergens ?? []);
        // Collect allergens from all family members
        const members = (data.family_members as any[]) ?? [];
        const famAllergens = members.flatMap((m: any) => m.allergens ?? []);
        setFamilyAllergens([...new Set(famAllergens)]);
      }
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { dietaryPreferences, allergens, familyAllergens, loading };
};
