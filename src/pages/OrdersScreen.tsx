import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, ChevronRight, RotateCcw, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/store/cartStore';
import { PRODUCTS } from '@/data/products';
import { toast } from 'sonner';

interface Order {
  id: string;
  status: string;
  delivery_slot: string | null;
  subtotal: number;
  total: number;
  created_at: string;
  items: { product_id: string; product_name: string; product_price: number; quantity: number }[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-accent/10', text: 'text-accent', label: 'Confirmed' },
  preparing: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Preparing' },
  delivering: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'On the way' },
  delivered: { bg: 'bg-primary/10', text: 'text-primary', label: 'Delivered' },
};

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error(ordersError);
        setLoading(false);
        return;
      }

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      const enriched: Order[] = ordersData.map(o => ({
        ...o,
        items: (itemsData || []).filter(i => i.order_id === o.id),
      }));

      setOrders(enriched);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const handleReorder = (order: Order) => {
    let added = 0;
    order.items.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.product_id);
      if (product) {
        for (let i = 0; i < item.quantity; i++) addItem(product);
        added += item.quantity;
      }
    });
    toast.success(`Added ${added} item${added !== 1 ? 's' : ''} to cart`);
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
        <h1 className="text-2xl font-display font-bold mb-6">Your Orders</h1>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">🔒</span>
          <p className="text-muted-foreground">Sign in to view your orders</p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Go to the Account tab to sign in or create an account.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
        <h1 className="text-2xl font-display font-bold mb-6">Your Orders</h1>
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
        <h1 className="text-2xl font-display font-bold mb-6">Your Orders</h1>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">📦</span>
          <p className="text-muted-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            When you place your first order, it'll show up here with tracking and reorder options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
      <h1 className="text-2xl font-display font-bold mb-4">Your Orders</h1>
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-none">
        {orders.map((order, idx) => {
          const status = statusColors[order.status] || statusColors.confirmed;
          const isExpanded = expandedId === order.id;
          const date = new Date(order.created_at);

          return (
            <motion.div key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-border bg-card overflow-hidden">

              <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full p-4 flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ${Number(order.total).toFixed(2)}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Clock size={12} />
                    <span>{date.toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {order.delivery_slot || 'Morning'}</span>
                  </div>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}× {item.product_name}
                          </span>
                          <span className="font-medium">${(item.product_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleReorder(order)}
                          className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center gap-2">
                          <RotateCcw size={14} />
                          Reorder This Trip
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersScreen;
