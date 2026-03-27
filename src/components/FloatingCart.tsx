import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface FloatingCartProps {
  onViewCart: () => void;
}

const FloatingCart = ({ onViewCart }: FloatingCartProps) => {
  const totalItems = useCartStore(s => s.totalItems());
  const totalPrice = useCartStore(s => s.totalPrice());

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          whileTap={{ scale: 0.97 }}
          onClick={onViewCart}
          className="grocer-floating-cart flex items-center gap-3 w-[calc(100%-2rem)] mx-auto"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-secondary-foreground">
              {totalItems}
            </span>
          </div>
          <span className="flex-1 text-left font-medium">
            ${totalPrice.toFixed(2)} · {totalItems} item{totalItems !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-medium opacity-80">View Cart →</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
