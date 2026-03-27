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

  return (
    <motion.div
      className={`grocer-product-card ${compact ? 'flex gap-3 p-3' : 'w-44 flex-shrink-0'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <img
        src={product.image}
        alt={product.name}
        className={compact ? 'w-16 h-16 rounded-lg object-cover' : 'w-full h-28 object-cover'}
      />
      <div className={compact ? 'flex-1 min-w-0' : 'p-3'}>
        <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
        <p className="text-sm font-medium leading-tight truncate">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
          {qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(product)}
              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
            >
              <Plus size={14} className="text-primary-foreground" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => qty === 1 ? removeItem(product.id) : updateQuantity(product.id, qty - 1)}
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center"
              >
                <Minus size={12} />
              </motion.button>
              <span className="text-sm font-bold w-4 text-center">{qty}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Plus size={12} className="text-primary-foreground" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
