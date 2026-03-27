import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TripDetails {
  resort: string;
  date: string;
  adults: number;
  kids: number;
}

export const useTripProfile = () => {
  const { user } = useAuth();
  const [savedTrip, setSavedTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('default_resort, default_adults, default_kids')
        .eq('id', user.id)
        .single();

      if (data?.default_resort) {
        setSavedTrip({
          resort: data.default_resort,
          date: '', // date is per-trip, not persisted
          adults: data.default_adults ?? 2,
          kids: data.default_kids ?? 0,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const saveTripDetails = async (trip: TripDetails) => {
    if (!user) return;

    await supabase
      .from('profiles')
      .update({
        default_resort: trip.resort,
        default_adults: trip.adults,
        default_kids: trip.kids,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSavedTrip(trip);
  };

  return { savedTrip, loading, saveTripDetails };
};
