import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CreditCard, MapPin, Check, Gift, Wine, Bell, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { useTripProfile } from '@/hooks/useTripProfile';
import { cart as cartApi } from '@/lib/api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import AlcoholIdVerification from '@/components/AlcoholIdVerification';
import BellServicesCard from '@/components/BellServicesCard';
import { isDisneyResort } from '@/data/products';

type CheckoutStep = 'delivery' | 'payment' | 'confirmed';

const TIME_SLOTS = [
  { id: '9', label: 'Morning', time: '9:00 AM - 4:00 PM', apiValue: '9am-4pm' },
  { id: '4', label: 'Evening', time: '4:00 PM - 10:00 PM', apiValue: '4pm-10pm' },
];

interface CheckoutScreenProps {
  onBack: () => void;
  onComplete: (orderId?: string) => void;
}

const CheckoutScreen = ({ onBack, onComplete }: CheckoutScreenProps) => {
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('delivery');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [processing, setProcessing] = useState(false);
  const [idMethod, setIdMethod] = useState<'upload' | 'at-delivery' | null>(null);
  const [bellAcknowledged, setBellAcknowledged] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResortId, setSelectedResortId] = useState<number>(0);

  const { user } = useAuth();
  const { savedTrip } = useTripProfile();

  const hasAlcohol = items.some(item => item.product.isAlcohol || item.product.is_liquor);
  const isDisney = savedTrip?.resort ? isDisneyResort(savedTrip.resort) : false;
  const resortName = savedTrip?.resort || '';

  const deliveryFee = totalPrice() >= 200 ? 0 : 15;
  const freeWine = totalPrice() >= 200;
  const total = totalPrice() + deliveryFee;

  // Load resorts
  useEffect(() => {
    cartApi.getResortsAndCities().then(res => {
      setResorts(res.data?.resorts || []);
      // Try to match saved resort
      if (savedTrip?.resort) {
        const match = (res.data?.resorts || []).find((r: any) =>
          r.resort_name?.toLowerCase().includes(savedTrip.resort.toLowerCase())
        );
        if (match) setSelectedResortId(match.id);
      }
    }).catch(() => {});
  }, [savedTrip]);

  // Generate delivery dates (next 14 days)
  const deliveryDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 2); // Minimum 2 days out
    return {
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  });

  const canProceedToPayment = selectedSlot && deliveryDate && (!isDisney || bellAcknowledged);

  // Calculate order summary when moving to payment
  const handleContinueToPayment = async () => {
    if (!canProceedToPayment) return;
    setProcessing(true);
    try {
      const res = await cartApi.calculateOrderSummary({
        order_type: 0,
        parent_id: 0,
        delivery_date: deliveryDate,
        delivery_time: selectedSlot === '9' ? '9am-4pm' : '4pm-10pm',
        gratuity: 0,
        gift_certificate: '',
        discount_name: '',
        use_credit: false,
      });
      setOrderSummary(res.data || res);
      setStep('payment');
    } catch (e: any) {
      toast.error(e.message || 'Failed to calculate order');
    }
    setProcessing(false);
  };

  // Initialize Square card form when payment step is shown
  useEffect(() => {
    if (step !== 'payment') return;
    const initSquare = async () => {
      try {
        const appId = import.meta.env.VITE_SQUARE_APP_ID_GG;
        const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID_GG;
        if (!appId || !(window as any).Square) return;

        const payments = (window as any).Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach('#square-card-container');
        (window as any).__squareCard = card;
      } catch (e) {
        console.error('Square init error:', e);
      }
    };
    // Small delay to ensure DOM is ready
    setTimeout(initSquare, 300);
  }, [step]);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    setProcessing(true);

    try {
      // Tokenize card with Square
      let nonce = '';
      const squareCard = (window as any).__squareCard;
      if (squareCard) {
        const tokenResult = await squareCard.tokenize();
        if (tokenResult.status === 'OK') {
          nonce = tokenResult.token;
        } else {
          toast.error('Please check your card details');
          setProcessing(false);
          return;
        }
      } else {
        toast.error('Payment form not ready. Please wait and try again.');
        setProcessing(false);
        return;
      }

      const timeSlot = TIME_SLOTS.find(s => s.id === selectedSlot);

      const res = await cartApi.capturePayment({
        order_type: 0,
        parent_id: 0,
        company: 'gg',
        nonce: nonce,
        amount: orderSummary?.gg_payment || total,
        original_subtotal: orderSummary?.subtotal || totalPrice(),
        delivery_date: deliveryDate,
        delivery_time: timeSlot?.apiValue || '9am-4pm',
        gratuity: 0,
        gift_certificate: '',
        discount: 0,
        discount_name: '',
        use_credit: false,
        first_name: user.first_name,
        last_name: user.last_name,
        delivery_type: 'resort',
        resort_id: selectedResortId,
        cell_phone: '',
        country: 'us',
        email: user.email,
        substitutions: false,
        device: 'Garden Grocer App - Capacitor',
        notes: specialInstructions,
        ip_address: '',
        app_version: '2.0.0',
      });

      const orderNumber = res.data?.order_number || res.data?.id;
      setCompletedOrderNumber(orderNumber ? String(orderNumber) : null);
      setStep('confirmed');
      clearCart();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Confetti on confirmation
  useEffect(() => {
    if (step !== 'confirmed') return;
    const duration = 2500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#2E8B3D', '#D4A843', '#FFE0A0', '#4CAF50'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#2E8B3D', '#D4A843', '#FFE0A0', '#4CAF50'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [step]);

  if (step === 'confirmed') {
    return (
      <div className="flex flex-col h-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D2818 0%, #1a3a24 50%, #FAF7F2 100%)' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, hsl(130 54% 23%), hsl(130 40% 35%))' }}>
            <Check size={36} className="text-white" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-2xl font-display font-bold text-white mb-2">Order Confirmed!</motion.h1>
          {completedOrderNumber && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-accent text-lg font-bold mb-2">Order #{completedOrderNumber}</motion.p>
          )}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="text-white/50 text-sm mb-8 max-w-xs">
            Your groceries will be delivered to {resortName || 'your location'}. We'll text you when it's ready.
          </motion.p>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            whileTap={{ scale: 0.97 }} onClick={() => onComplete()}
            className="py-3 px-8 rounded-full font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
            Back to Shopping
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft size={18} />
        </motion.button>
        <div>
          <h1 className="text-xl font-display font-bold">Checkout</h1>
          <p className="text-xs text-muted-foreground">{totalItems()} items · ${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-3">
        {['Delivery', 'Payment'].map((label, i) => {
          const active = i === (step === 'delivery' ? 0 : 1);
          const done = (step === 'payment' && i === 0);
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                done ? 'bg-primary text-primary-foreground' : active ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {done ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${active || done ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i === 0 && <div className="flex-1 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {step === 'delivery' && (
            <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">

              {isDisney && <BellServicesCard resortName={resortName} onAcknowledge={setBellAcknowledged} />}

              {/* Delivery Date */}
              <div>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-accent" /> Delivery Date
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {deliveryDates.slice(0, 8).map(d => (
                    <motion.button key={d.value} whileTap={{ scale: 0.98 }}
                      onClick={() => setDeliveryDate(d.value)}
                      className={`p-3 rounded-xl border text-left text-sm transition-all ${
                        deliveryDate === d.value ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30'
                      }`}>
                      {d.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-accent" /> Delivery Window
                </h2>
                <div className="space-y-2">
                  {TIME_SLOTS.map(slot => (
                    <motion.button key={slot.id} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedSlot === slot.id ? 'border-accent bg-accent/5 shadow-sm' : 'border-border hover:border-accent/30'
                      }`}>
                      <div>
                        <p className="text-sm font-medium">{slot.label}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </div>
                      {selectedSlot === slot.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">Special instructions</h2>
                <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="Leave at bell services, call on arrival, etc." rows={3}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors resize-none placeholder:text-muted-foreground" />
              </div>

              {hasAlcohol && <AlcoholIdVerification onComplete={setIdMethod} />}

              {/* Order summary */}
              <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems()} items)</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {freeWine && (
                  <div className="flex justify-between text-accent">
                    <span>Complimentary wine</span>
                    <span className="font-medium">Included</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }}
                onClick={handleContinueToPayment}
                disabled={!canProceedToPayment || (hasAlcohol && !idMethod) || processing}
                className="w-full py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 transition-opacity flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
                {processing ? <><Loader2 size={16} className="animate-spin" /> Calculating...</> : 'Continue to Payment'}
              </motion.button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">

              {/* Order Summary from API */}
              {orderSummary && (
                <div className="rounded-xl border border-accent/20 p-4 space-y-2 text-sm"
                  style={{ background: 'rgba(212,168,67,0.05)' }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${Number(orderSummary.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>${Number(orderSummary.delivery_fee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${Number(orderSummary.sales_tax || 0).toFixed(2)}</span>
                  </div>
                  {orderSummary.discount && orderSummary.discount !== 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({orderSummary.discount_name})</span>
                      <span>-${Math.abs(Number(orderSummary.discount)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-lg">${Number(orderSummary.grand_total || total).toFixed(2)}</span>
                  </div>
                  {orderSummary.alcohol_payment > 0 && (
                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      <p>Grocery charge: ${Number(orderSummary.gg_payment).toFixed(2)} (Garden Grocer)</p>
                      <p>Alcohol charge: ${Number(orderSummary.alcohol_payment).toFixed(2)} (Golden Ox Liquors)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Square Payment Form placeholder */}
              <div className="rounded-xl border border-border p-6 text-center space-y-3">
                <CreditCard size={32} className="mx-auto text-accent" />
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-xs text-muted-foreground">
                  Payment is processed securely by Square. Your card details are never stored on our servers.
                </p>
                <div id="square-card-container" className="min-h-[100px] flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Loading secure payment form...</p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('delivery')}
                  className="py-3 px-5 rounded-full border border-border text-sm font-medium">
                  Back
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 transition-opacity relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Place Order · $${Number(orderSummary?.grand_total || total).toFixed(2)}`
                  )}
                </motion.button>
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                Payments secured by Square
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutScreen;
