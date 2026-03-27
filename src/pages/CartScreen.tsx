import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface CartScreenProps {
  onTalkToGrocer: () => void;
}

const CartScreen = ({ onTalkToGrocer }: CartScreenProps) => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const deliveryFee = totalPrice() >= 200 ? 0 : 14.99;
  const freeDeliveryGap = Math.max(0, 200 - totalPrice());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-display font-bold">Your Cart</h1>
        <p className="text-sm text-muted-foreground">{totalItems()} items</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="text-5xl">🛒</span>
            <p className="text-muted-foreground">Your cart is empty</p>
            <button onClick={onTalkToGrocer} className="grocer-pill selected flex items-center gap-2">
              <MessageCircle size={16} />
              Ask Grocer to build your list
            </button>
          </div>
        ) : (
          <>
            {freeDeliveryGap > 0 && (
              <div className="bg-secondary/20 rounded-xl p-3 mb-4 border border-secondary/30">
                <p className="text-sm font-medium">🍷 Add ${freeDeliveryGap.toFixed(2)} more for <strong>free delivery + free wine!</strong></p>
              </div>
            )}

            <div className="space-y-3">
              {items.map(item => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex items-center gap-3 grocer-input-card"
                >
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <p className="text-sm font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Plus size={12} className="text-primary-foreground" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Ask Grocer */}
            <button onClick={onTalkToGrocer} className="w-full mt-4 grocer-input-card flex items-center justify-center gap-2 text-primary font-medium text-sm">
              <MessageCircle size={16} />
              "Anything I'm forgetting?" — Ask Grocer
            </button>

            {/* Summary */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${(totalPrice() + deliveryFee).toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full mt-4 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base"
            >
              Proceed to Checkout
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
