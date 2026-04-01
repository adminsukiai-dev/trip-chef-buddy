import { useState, useEffect, useCallback } from 'react';
import { user as userApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    try {
      const res = await userApi.getFavorites();
      const ids = (res.data || []).map((f: any) => String(f.product_id || f.id));
      setFavoriteIds(new Set(ids));
    } catch {
      setFavoriteIds(new Set());
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (productId: string) => {
    if (!user) return;
    const isFav = favoriteIds.has(productId);

    // Optimistic update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (isFav) {
        await userApi.removeFromFavorites(Number(productId));
      } else {
        await userApi.addToFavorites(Number(productId));
      }
    } catch {
      // Revert on error
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }, [user, favoriteIds]);

  const isFavorite = useCallback((productId: string) => favoriteIds.has(productId), [favoriteIds]);

  return { favoriteIds, loading, toggleFavorite, isFavorite };
};
