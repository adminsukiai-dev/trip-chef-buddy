import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(i => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  if (compact) {
    return (
      <motion.div
        className="flex gap-3 p-3 rounded-xl bg-card border border-border/50"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        layout
      >
        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <p className="text-sm font-medium leading-tight truncate">{product.name}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
            {qty === 0 ? (
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => addItem(product)}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <Plus size={14} className="text-primary-foreground" />
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => qty === 1 ? removeItem(product.id) : updateQuantity(product.id, qty - 1)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Minus size={12} />
                </motion.button>
                <span className="text-sm font-bold w-4 text-center">{qty}</span>
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(product.id, qty + 1)}
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

  // Premium horizontal card for inline chat
  return (
    <motion.div
      className="w-40 flex-shrink-0 rounded-xl overflow-hidden bg-card border border-border/40"
      style={{ boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)' }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      layout
    >
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
        {product.popular && (
          <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-accent/90 text-accent-foreground font-semibold">
            Popular
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
        <p className="text-xs font-medium leading-tight mt-0.5 line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
          {qty === 0 ? (
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => addItem(product)}
              className="w-7 h-7 rounded-full flex items-center justify-center border-2 border-accent bg-transparent hover:bg-accent/10 transition-colors">
              <Plus size={14} className="text-accent" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-1.5">
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => qty === 1 ? removeItem(product.id) : updateQuantity(product.id, qty - 1)}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                <Minus size={10} />
              </motion.button>
              <span className="text-xs font-bold w-3 text-center">{qty}</span>
              <motion.button whileTap={{ scale: 0.85 }}
                onClick={() => updateQuantity(product.id, qty + 1)}
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
