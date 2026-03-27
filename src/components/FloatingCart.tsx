import { motion, AnimatePresence } from 'framer-motion';
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
          initial={{ y: 60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.95 }}
          whileTap={{ scale: 0.97 }}
          onClick={onViewCart}
          className="w-full rounded-2xl px-5 py-3.5 flex items-center gap-3"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">{totalItems}</span>
          </div>
          <span className="flex-1 text-left text-sm font-medium text-foreground">
            Cart · {totalItems} item{totalItems !== 1 ? 's' : ''} · ${totalPrice.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">View →</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
