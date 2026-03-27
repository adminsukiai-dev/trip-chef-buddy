import { motion } from 'framer-motion';
import { Package, Clock, MapPin } from 'lucide-react';

const OrdersScreen = () => (
  <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
    <h1 className="text-2xl font-display font-bold mb-6">Your Orders</h1>
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <span className="text-5xl">📦</span>
      <p className="text-muted-foreground">No orders yet</p>
      <p className="text-sm text-muted-foreground text-center max-w-xs">When you place your first order, it'll show up here with real-time tracking.</p>
    </div>
  </div>
);

export default OrdersScreen;
