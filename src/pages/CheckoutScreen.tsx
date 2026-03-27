import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CreditCard, MapPin, Check, Gift, Wine } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type CheckoutStep = 'delivery' | 'payment' | 'confirmed';

const TIME_SLOTS = [
  { id: '1', label: 'Early Morning', time: '7:00 AM – 9:00 AM', premium: false },
  { id: '2', label: 'Morning', time: '9:00 AM – 11:00 AM', premium: false },
  { id: '3', label: 'Midday', time: '11:00 AM – 1:00 PM', premium: false },
  { id: '4', label: 'Afternoon', time: '1:00 PM – 3:00 PM', premium: false },
  { id: '5', label: 'Evening', time: '5:00 PM – 7:00 PM', premium: true },
];

interface CheckoutScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutScreen = ({ onBack, onComplete }: CheckoutScreenProps) => {
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('delivery');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const deliveryFee = totalPrice() >= 200 ? 0 : 14.99;
  const freeWine = totalPrice() >= 200;
  const total = totalPrice() + deliveryFee;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setStep('confirmed');
      setProcessing(false);
      clearCart();
    }, 1800);
  };

  // Confetti on confirmation
  useEffect(() => {
    if (step !== 'confirmed') return;
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#2E8B3D', '#D4A843', '#FFE0A0', '#4CAF50'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#2E8B3D', '#D4A843', '#FFE0A0', '#4CAF50'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [step]);

  // Confirmed screen
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
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="text-white/50 text-sm mb-8 max-w-xs">
            Your groceries will be delivered to bell services before you arrive. We'll text you when it's ready.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="w-full max-w-sm space-y-3">
            <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-accent" />
                <span className="text-sm text-white/70">Delivery: {TIME_SLOTS.find(s => s.id === selectedSlot)?.time || 'Morning'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-accent" />
                <span className="text-sm text-white/70">Bell services at your resort</span>
              </div>
              {freeWine && (
                <div className="flex items-center gap-3">
                  <Wine size={16} className="text-accent" />
                  <span className="text-sm text-accent">Complimentary wine included 🍷</span>
                </div>
              )}
            </div>

            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <Gift size={20} className="text-accent mx-auto mb-1" />
              <p className="text-xs text-accent">You earned 10% off your next order!</p>
            </div>
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            whileTap={{ scale: 0.97 }} onClick={onComplete}
            className="mt-8 py-3 px-8 rounded-full font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
            Back to Grocer
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
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

      {/* Step indicator */}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {step === 'delivery' && (
            <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-accent" /> Choose a delivery window
                </h2>
                <div className="space-y-2">
                  {TIME_SLOTS.map(slot => (
                    <motion.button key={slot.id} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedSlot === slot.id
                          ? 'border-accent bg-accent/5 shadow-sm'
                          : 'border-border hover:border-accent/30'
                      }`}>
                      <div>
                        <p className="text-sm font-medium">{slot.label}</p>
                        <p className="text-xs text-muted-foreground">{slot.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {slot.premium && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Popular</span>}
                        {selectedSlot === slot.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">Special instructions</h2>
                <textarea
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="Leave at bell services, call on arrival, etc."
                  rows={3}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors resize-none placeholder:text-muted-foreground"
                />
              </div>

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
                    <span>🍷 Complimentary wine</span>
                    <span className="font-medium">Included</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => selectedSlot && setStep('payment')}
                disabled={!selectedSlot}
                className="w-full py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 transition-opacity"
                style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
                Continue to Payment
              </motion.button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CreditCard size={16} className="text-accent" /> Payment details
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Name on card</label>
                    <input type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Card number</label>
                    <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground font-mono" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Expiry</label>
                      <input type="text" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground font-mono" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">CVC</label>
                      <input type="text" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-muted-foreground font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini summary */}
              <div className="rounded-xl border border-accent/20 p-4 flex items-center justify-between"
                style={{ background: 'rgba(212,168,67,0.05)' }}>
                <div>
                  <p className="text-sm font-bold">${total.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{totalItems()} items · {TIME_SLOTS.find(s => s.id === selectedSlot)?.label}</p>
                </div>
                {freeWine && <span className="text-sm">🍷</span>}
              </div>

              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('delivery')}
                  className="py-3 px-5 rounded-full border border-border text-sm font-medium">
                  Back
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  disabled={!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3 || processing}
                  className="flex-1 py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 transition-opacity relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, hsl(42 55% 55%), hsl(42 45% 45%))', color: 'white' }}>
                  {processing ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                      Processing...
                    </motion.span>
                  ) : (
                    `Place Order · $${total.toFixed(2)}`
                  )}
                </motion.button>
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 This is a demo — no real charges will be made
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutScreen;
