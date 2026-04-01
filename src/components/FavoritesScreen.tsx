import { ArrowLeft, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
// Products loaded from API via favorites hook
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useUserDietaryProfile } from '@/hooks/useUserDietaryProfile';

interface FavoritesScreenProps {
  onBack: () => void;
}

const FavoritesScreen = ({ onBack }: FavoritesScreenProps) => {
  const { favoriteIds, loading, toggleFavorite, isFavorite } = useFavorites();
  const { allergens, familyAllergens, dietaryPreferences } = useUserDietaryProfile();
  const allAllergens = [...new Set([...allergens, ...familyAllergens])];

  const favoriteProducts = PRODUCTS.filter(p => favoriteIds.has(p.id));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold">Favorites</h1>
          <p className="text-xs text-muted-foreground">Your saved products</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart size={28} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold mb-1">No favorites yet</p>
            <p className="text-sm text-muted-foreground max-w-[240px]">
              Tap the heart icon on any product to save it here for quick access
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">{favoriteProducts.length} saved item{favoriteProducts.length !== 1 ? 's' : ''}</p>
            {favoriteProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                userAllergens={allAllergens}
                userDietary={dietaryPreferences}
                showFavorite
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;
