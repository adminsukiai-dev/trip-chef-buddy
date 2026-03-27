import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);
    setFavoriteIds(new Set((data ?? []).map(d => d.product_id)));
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

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });
    }
  }, [user, favoriteIds]);

  const isFavorite = useCallback((productId: string) => favoriteIds.has(productId), [favoriteIds]);

  return { favoriteIds, loading, toggleFavorite, isFavorite };
};
