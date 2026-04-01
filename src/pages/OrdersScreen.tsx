import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, ChevronRight, RotateCcw, Truck, ChefHat, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { user as userApi, cart as cartApi } from '@/lib/api';
import { toast } from 'sonner';

interface OrderItem {
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Order {
  id: number;
  order_number: number;
  status: string;
  delivery_date: string;
  delivery_time: string;
  resort: string;
  total: number;
  subtotal: number;
  paid: boolean;
  cancelled: boolean;
  created_at: string;
  items: OrderItem[];
}

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await userApi.getOrders();
      const rawOrders = res.data || [];
      const mapped: Order[] = rawOrders.map((o: any) => ({
        id: o.id,
        order_number: o.order_number || o.id,
        status: o.cancelled ? 'cancelled' : (o.paid ? 'confirmed' : 'pending'),
        delivery_date: o.attributes?.delivery_info?.delivery_date || o.delivery_date || '',
        delivery_time: o.attributes?.delivery_info?.delivery_time || '',
        resort: o.attributes?.delivery_info?.resort || o.resort || '',
        total: parseFloat(o.attributes?.balance?.total || o.total || 0),
        subtotal: parseFloat(o.attributes?.balance?.subtotal || o.subtotal || 0),
        paid: !!o.paid,
        cancelled: !!o.cancelled,
        created_at: o.created || o.created_at || '',
        items: (o.attributes?.shopping_cart_items || []).map((i: any) => ({
          product_id: i.attributes?.product?.id || i.pid || 0,
          product_name: i.attributes?.product?.attributes?.name || i.item_name || '',
          product_price: parseFloat(i.attributes?.price || i.gc_price || 0),
          quantity: i.attributes?.qty || i.qty || 1,
        })),
      }));
      setOrders(mapped);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchOrders();
  }, [user, fetchOrders]);

  const handleReorder = async (order: Order) => {
    let added = 0;
    for (const item of order.items) {
      try {
        await cartApi.addItem(item.product_id, item.quantity);
        added += item.quantity;
      } catch {}
    }
    if (added > 0) {
      toast.success(`Added ${added} item${added !== 1 ? 's' : ''} to cart`);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
        <h1 className="text-2xl font-display font-bold mb-6">Your Orders</h1>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">🔒</span>
          <p className="text-muted-foreground">Sign in to view your orders</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
      <h1 className="text-2xl font-display font-bold mb-4">Your Orders</h1>
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-none">
        {orders.map((order, idx) => {
          const isExpanded = expandedId === order.id;
          const deliveryStr = order.delivery_date
            ? new Date(order.delivery_date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
            : '';

          return (
            <motion.div key={order.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border overflow-hidden border-border bg-card">

              <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                    <Package size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      Order #{order.order_number} · ${order.total.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock size={12} />
                      <span>{deliveryStr} · {order.resort}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      order.cancelled ? 'bg-red-100 text-red-600' :
                      order.paid ? 'bg-emerald-100 text-emerald-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      {order.cancelled ? 'Cancelled' : order.paid ? 'Paid' : 'Pending'}
                    </span>
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      {order.items.length > 0 ? order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="font-medium">${(item.product_price * item.quantity).toFixed(2)}</span>
                        </div>
                      )) : (
                        <p className="text-sm text-muted-foreground">Item details not available</p>
                      )}

                      <div className="pt-2 border-t border-border">
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleReorder(order)}
                          className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center gap-2">
                          <RotateCcw size={14} />
                          Reorder
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
