import { motion } from 'framer-motion';
import { Plus, Minus, AlertTriangle, Leaf, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

// Flexible product interface that works with both old and new data
interface ProductLike {
  id: string | number;
  name: string;
  brand?: string;
  price: number;
  image: string;
  category?: string;
  subcategory?: string;
  dietary?: string[];
  allergens?: string[];
  popular?: boolean;
  isAlcohol?: boolean;
  is_liquor?: boolean;
  description?: string;
}

interface ProductCardProps {
  product: ProductLike;
  compact?: boolean;
  userAllergens?: string[];
  userDietary?: string[];
  showFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

const ALLERGEN_LABELS: Record<string, string> = {
  'peanuts': 'Peanuts', 'tree-nuts': 'Tree Nuts', 'milk': 'Milk', 'eggs': 'Eggs',
  'wheat': 'Wheat', 'soy': 'Soy', 'fish': 'Fish', 'shellfish': 'Shellfish',
  'sesame': 'Sesame', 'gluten': 'Gluten', 'corn': 'Corn', 'sulfites': 'Sulfites',
};

const ProductCard = ({ product, compact = false, userAllergens = [], userDietary = [], showFavorite = false, isFavorite = false, onToggleFavorite }: ProductCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => String(i.product.id) === String(product.id));
  const qty = cartItem?.quantity ?? 0;

  const matchingAllergens = userAllergens.length && product.allergens?.length
    ? product.allergens.filter(a => userAllergens.includes(a))
    : [];
  const dietaryMatches = userDietary.length && product.dietary?.length
    ? product.dietary.filter(d => userDietary.includes(d))
    : [];
  const hasAllergenWarning = matchingAllergens.length > 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      isAlcohol: product.isAlcohol || product.is_liquor,
    });
  };

  const AllergenBadge = () => (
    hasAllergenWarning ? (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-destructive/15 text-destructive border border-destructive/30">
        <AlertTriangle size={9} />
        {matchingAllergens.map(a => ALLERGEN_LABELS[a] || a).join(', ')}
      </motion.div>
    ) : null
  );

  const DietaryBadge = () => (
    dietaryMatches.length > 0 ? (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/15 text-primary border border-primary/30">
        <Leaf size={9} />
        {dietaryMatches.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
      </motion.div>
    ) : null
  );

  if (compact) {
    return (
      <motion.div
        className={`flex gap-3 p-3 rounded-xl bg-card border ${hasAllergenWarning ? 'border-destructive/40' : 'border-border/50'}`}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} layout
      >
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-muted"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.gardengrocer.com/images/products/placeholder.jpg'; }} />
          {hasAllergenWarning && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
              <AlertTriangle size={9} className="text-destructive-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              {product.brand && <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.brand}</p>}
              <p className="text-sm font-medium leading-tight truncate">{product.name}</p>
            </div>
            {showFavorite && onToggleFavorite && (
              <motion.button whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(String(product.id)); }}
                className="ml-1 flex-shrink-0">
                <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
              </motion.button>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            <AllergenBadge />
            <DietaryBadge />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
            {qty === 0 ? (
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleAdd}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Plus size={14} className="text-primary-foreground" />
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => qty === 1 ? removeItem(String(product.id)) : updateQuantity(String(product.id), qty - 1)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Minus size={12} />
                </motion.button>
                <span className="text-sm font-bold w-4 text-center">{qty}</span>
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(String(product.id), qty + 1)}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Plus size={12} className="text-primary-foreground" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Card for inline chat recommendations
  return (
    <motion.div
      className={`w-40 flex-shrink-0 rounded-xl overflow-hidden bg-card border ${hasAllergenWarning ? 'border-destructive/40' : 'border-border/40'}`}
      style={{ boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }} transition={{ duration: 0.25 }} layout
    >
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-24 object-cover bg-muted"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.gardengrocer.com/images/products/placeholder.jpg'; }} />
        {product.popular && !hasAllergenWarning && (
          <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-accent/90 text-accent-foreground font-semibold">Popular</span>
        )}
      </div>
      <div className="p-2.5">
        {product.brand && <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>}
        <p className="text-xs font-medium leading-tight mt-0.5 line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
          {qty === 0 ? (
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleAdd}
              className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-accent bg-transparent hover:bg-accent/10 transition-colors">
              <Plus size={14} className="text-accent" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5">
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => qty === 1 ? removeItem(String(product.id)) : updateQuantity(String(product.id), qty - 1)}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <Minus size={10} />
              </motion.button>
              <span className="text-xs font-bold w-3 text-center">{qty}</span>
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => updateQuantity(String(product.id), qty + 1)}
                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Plus size={10} className="text-primary-foreground" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
