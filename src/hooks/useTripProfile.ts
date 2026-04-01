import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface TripDetails {
  resort: string;
  date: string;
  adults: number;
  kids: number;
}

const STORAGE_KEY = 'gg_trip_profile';

export const useTripProfile = () => {
  const { user } = useAuth();
  const [savedTrip, setSavedTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedTrip(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, [user]);

  const saveTripDetails = async (trip: TripDetails) => {
    setSavedTrip(trip);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  };

  return { savedTrip, loading, saveTripDetails };
};
