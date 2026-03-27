import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Package, Truck, MapPin, Phone, MessageCircle, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

const STATUSES = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, color: 'text-accent' },
  { key: 'shopping', label: 'Shopping Your Items', icon: Loader2, color: 'text-blue-500' },
  { key: 'packing', label: 'Packing Your Order', icon: Package, color: 'text-purple-500' },
  { key: 'delivering', label: 'On The Way', icon: Truck, color: 'text-accent' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-primary' },
];

interface DeliveryTrackerProps {
  orderId: string;
  resortName?: string;
  onBack: () => void;
}

const DeliveryTracker = ({ orderId, resortName, onBack }: DeliveryTrackerProps) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [eta, setEta] = useState(25);
  const [driverPos, setDriverPos] = useState({ x: 20, y: 70 });

  // Simulate progression
  useEffect(() => {
    if (currentStatus >= STATUSES.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev >= STATUSES.length - 1) return prev;
        return prev + 1;
      });
      setEta(prev => Math.max(0, prev - 6));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  // Animate driver position when delivering
  useEffect(() => {
    if (STATUSES[currentStatus]?.key !== 'delivering') return;

    const interval = setInterval(() => {
      setDriverPos(prev => ({
        x: Math.min(75, prev.x + 3 + Math.random() * 4),
        y: Math.max(30, prev.y - 2 - Math.random() * 3),
      }));
    }, 800);

    return () => clearInterval(interval);
  }, [currentStatus]);

  // Confetti on delivery
  useEffect(() => {
    if (STATUSES[currentStatus]?.key !== 'delivered') return;
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ['#2E8B3D', '#D4A843', '#FFE0A0'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ['#2E8B3D', '#D4A843', '#FFE0A0'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [currentStatus]);

  const isDelivering = STATUSES[currentStatus]?.key === 'delivering';
  const isDelivered = STATUSES[currentStatus]?.key === 'delivered';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onBack}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <ChevronLeft size={18} />
        </motion.button>
        <div>
          <h1 className="text-xl font-display font-bold">Order Tracking</h1>
          <p className="text-xs text-muted-foreground">Order #{orderId.slice(0, 8)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Map Placeholder */}
        <AnimatePresence>
          {(isDelivering || isDelivered) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 220, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9, #e0f2f1)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              {/* Simple map visualization */}
              <div className="absolute inset-0">
                {/* Grid lines for map feel */}
                {[...Array(8)].map((_, i) => (
                  <div key={`h${i}`} className="absolute w-full h-px bg-primary/5" style={{ top: `${(i + 1) * 12}%` }} />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={`v${i}`} className="absolute h-full w-px bg-primary/5" style={{ left: `${(i + 1) * 12}%` }} />
                ))}

                {/* Route dotted line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <path
                    d={`M ${driverPos.x} ${driverPos.y} Q 60 50 80 25`}
                    fill="none"
                    stroke="hsl(130, 54%, 23%)"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                </svg>

                {/* Driver pin (gold) */}
                {!isDelivered && (
                  <motion.div
                    animate={{ x: `${driverPos.x}%`, y: `${driverPos.y}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'hsl(42, 55%, 55%)', boxShadow: '0 0 12px rgba(212,168,67,0.5)' }}
                    >
                      <Truck size={8} className="text-white" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Customer pin (green) */}
                <div className="absolute" style={{ left: '80%', top: '25%', transform: 'translate(-50%, -50%)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'hsl(130, 54%, 23%)', boxShadow: '0 0 12px rgba(46,139,61,0.4)' }}>
                    <MapPin size={10} className="text-white" />
                  </div>
                  <p className="text-[8px] font-medium text-primary mt-1 whitespace-nowrap text-center">{resortName || 'Your Location'}</p>
                </div>
              </div>

              {/* ETA badge */}
              {!isDelivered && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  🚗 ~{eta} min away
                </div>
              )}

              {isDelivered && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="text-center">
                    <span className="text-4xl">🎉</span>
                    <p className="text-sm font-bold text-primary mt-1">Delivered!</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ETA Card */}
        {!isDelivered && (
          <div className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <p className="text-sm text-muted-foreground">Estimated arrival</p>
            <p className="text-2xl font-display font-bold text-foreground">~{eta} minutes</p>
          </div>
        )}

        {/* Status Timeline */}
        <div className="rounded-2xl border border-border p-4 space-y-0">
          {STATUSES.map((status, i) => {
            const isPast = i < currentStatus;
            const isCurrent = i === currentStatus;
            const isFuture = i > currentStatus;
            const Icon = status.icon;

            return (
              <div key={status.key} className="flex items-start gap-3">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPast || isCurrent ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    {isCurrent && status.key === 'shopping' ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Icon size={14} className={status.color} />
                      </motion.div>
                    ) : (
                      <Icon size={14} className={isPast || isCurrent ? status.color : 'text-muted-foreground'} />
                    )}
                  </motion.div>
                  {i < STATUSES.length - 1 && (
                    <div className={`w-0.5 h-8 rounded-full transition-colors ${
                      isPast ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>

                <div className="pt-1.5">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-foreground' : isPast ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {status.label}
                    {isCurrent && !isDelivered && (
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
                      >
                        Active
                      </motion.span>
                    )}
                  </p>
                  {isPast && (
                    <p className="text-[11px] text-muted-foreground">Completed</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Driver Card */}
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              👩
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Maria C.</p>
              <p className="text-xs text-muted-foreground">Your shopper</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium">
              ⭐ 4.9
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
              <Phone size={14} className="text-primary" />
              Contact Shopper
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
              <MessageCircle size={14} className="text-accent" />
              Contact Support
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;
