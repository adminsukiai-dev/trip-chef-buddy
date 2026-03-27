import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, ChevronRight, RotateCcw, Truck, ChefHat, CheckCircle2, Circle } from 'lucide-react';
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
  status_updated_at: string | null;
  estimated_delivery: string | null;
  items: { product_id: string; product_name: string; product_price: number; quantity: number }[];
}

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-accent' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, color: 'text-blue-500' },
  { key: 'delivering', label: 'On the way', icon: Truck, color: 'text-purple-500' },
  { key: 'delivered', label: 'Delivered', icon: Package, color: 'text-primary' },
];

const OrderTracker = ({ status }: { status: string }) => {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);

  return (
    <div className="flex items-center gap-1 py-3">
      {STATUS_STEPS.map((step, i) => {
        const isActive = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <motion.div
                animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: isCurrent && status !== 'delivered' ? Infinity : 0, duration: 1.5 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? `${step.color} bg-current/10` : 'text-muted-foreground bg-muted'
                }`}
                style={isActive ? { backgroundColor: `currentColor`, opacity: 0.12 } : {}}
              >
                <Icon size={14} className={isActive ? step.color : 'text-muted-foreground'} />
              </motion.div>
              <span className={`text-[9px] font-medium text-center leading-tight ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}>{step.label}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-full mx-0.5 rounded-full transition-colors ${
                i < currentIdx ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const addItem = useCartStore(s => s.addItem);

  const fetchOrders = useCallback(async () => {
    if (!user) return;

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
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user, fetchOrders]);

  // Real-time subscription for order status changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updated = payload.new as any;
          setOrders(prev =>
            prev.map(o =>
              o.id === updated.id
                ? { ...o, status: updated.status, status_updated_at: updated.status_updated_at }
                : o
            )
          );

          // Show toast for status changes
          const step = STATUS_STEPS.find(s => s.key === updated.status);
          if (step) {
            toast.success(`Order update: ${step.label}`, {
              description: updated.status === 'delivered' 
                ? 'Your groceries have arrived! 🎉' 
                : `Your order is now ${step.label.toLowerCase()}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  // Simulate status progression for demo
  const simulateProgress = async (orderId: string) => {
    try {
      const response = await supabase.functions.invoke('order-status', {
        body: { order_id: orderId },
      });
      if (response.error) throw response.error;
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
    }
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
            When you place your first order, it'll show up here with real-time tracking.
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
          const isExpanded = expandedId === order.id;
          const date = new Date(order.created_at);
          const isActive = order.status !== 'delivered';
          const currentStep = STATUS_STEPS.find(s => s.key === order.status);

          return (
            <motion.div key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border overflow-hidden ${
                isActive ? 'border-accent/30 bg-card shadow-sm' : 'border-border bg-card'
              }`}>

              <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-accent/10' : 'bg-primary/10'
                  }`}>
                    {isActive ? (
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        {currentStep && <currentStep.icon size={18} className={currentStep.color} />}
                      </motion.div>
                    ) : (
                      <Package size={18} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ${Number(order.total).toFixed(2)}
                      </p>
                      {isActive && (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent">
                          Live
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock size={12} />
                      <span>{date.toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {currentStep?.label || order.status}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Always show tracker for active orders */}
                {isActive && <OrderTracker status={order.status} />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                      {/* Show tracker for delivered orders when expanded */}
                      {!isActive && <OrderTracker status={order.status} />}

                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}× {item.product_name}
                          </span>
                          <span className="font-medium">${(item.product_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-border space-y-2">
                        {/* Demo: simulate status progression */}
                        {isActive && (
                          <motion.button whileTap={{ scale: 0.97 }} onClick={() => simulateProgress(order.id)}
                            className="w-full py-2.5 rounded-xl bg-accent/10 text-accent text-sm font-semibold flex items-center justify-center gap-2">
                            <Truck size={14} />
                            Simulate Next Status
                          </motion.button>
                        )}

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
