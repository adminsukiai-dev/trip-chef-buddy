import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, Users, CalendarDays, MapPin, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ConciergeScreen from '@/pages/ConciergeScreen';
import BrowseScreen from '@/pages/BrowseScreen';
import CartScreen from '@/pages/CartScreen';
import CheckoutScreen from '@/pages/CheckoutScreen';
import OrdersScreen from '@/pages/OrdersScreen';
import AccountScreen from '@/pages/AccountScreen';
import { ORLANDO_RESORTS } from '@/data/products';
import { useAuth } from '@/hooks/useAuth';
import { useTripProfile, TripDetails } from '@/hooks/useTripProfile';

/* ─── Typewriter Effect ─── */
const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(interval);
      }, 45);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <>{displayed}<span className="animate-pulse">|</span></>;
};

/* ─── Trip Setup Step Components ─── */
const ResortStep = ({ onComplete }: { onComplete: (resort: string) => void }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');
  const filtered = ORLANDO_RESORTS.filter(r => r.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm px-6 space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <MapPin size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-white">Where are you staying?</h3>
          <p className="text-xs text-white/50">Resort, hotel, or vacation rental</p>
        </div>
      </div>
      <input
        type="text"
        value={search}
        onChange={e => { setSearch(e.target.value); setSelected(''); }}
        placeholder="Search resorts..."
        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition-colors"
      />
      <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-none">
        {filtered.slice(0, 10).map(resort => (
          <button key={resort} onClick={() => { setSelected(resort); setSearch(resort); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${selected === resort ? 'bg-accent/20 text-accent' : 'text-white/70 hover:bg-white/5'}`}>
            {selected === resort && <span className="text-accent">✓</span>}
            {resort}
          </button>
        ))}
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => selected && onComplete(selected)}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-30 flex items-center justify-center gap-2 transition-opacity">
        Continue <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

const DateStep = ({ onComplete }: { onComplete: (date: string) => void }) => {
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });
  const [selected, setSelected] = useState<Date | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm px-6 space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <CalendarDays size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-white">When do you arrive?</h3>
          <p className="text-xs text-white/50">Select your check-in date</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map((d) => {
          const isSelected = selected?.toDateString() === d.toDateString();
          return (
            <motion.button key={d.toISOString()} whileTap={{ scale: 0.9 }} onClick={() => setSelected(d)}
              className={`flex flex-col items-center py-2 rounded-lg text-xs transition-colors ${isSelected ? 'bg-accent text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
              <span className="text-[9px] uppercase">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
              <span className="font-semibold text-sm">{d.getDate()}</span>
            </motion.button>
          );
        })}
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => selected && onComplete(selected.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' }))}
        disabled={!selected}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-30 flex items-center justify-center gap-2 transition-opacity">
        Continue <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

const GuestsStep = ({ onComplete }: { onComplete: (guests: { adults: number; kids: number }) => void }) => {
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);

  const Counter = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-white/80">{label}</span>
      <div className="flex items-center gap-4">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 transition-colors text-lg">
          −
        </motion.button>
        <motion.span key={value} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          className="text-lg font-bold text-white w-6 text-center">{value}</motion.span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/15 transition-colors text-lg">
          +
        </motion.button>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm px-6 space-y-4 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Users size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-white">Who's coming?</h3>
          <p className="text-xs text-white/50">We'll tailor quantities to your group</p>
        </div>
      </div>
      <div className="bg-white/5 rounded-xl px-4 divide-y divide-white/5">
        <Counter label="Adults" value={adults} onChange={setAdults} />
        <Counter label="Kids" value={kids} onChange={setKids} />
      </div>
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => (adults + kids > 0) && onComplete({ adults, kids })}
        disabled={adults + kids === 0}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-30 flex items-center justify-center gap-2 transition-opacity">
        Let's Shop <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

/* ─── Splash & Onboarding ─── */
const SplashScreen = ({ onStart }: { onStart: (mode: string) => void }) => {
  const [step, setStep] = useState<'welcome' | 'resort' | 'date' | 'guests'>('welcome');
  const [tripInfo, setTripInfo] = useState({ resort: '', date: '', adults: 0, kids: 0 });

  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060E08 0%, #0D2818 40%, #143820 100%)' }}>
      
      {/* Subtle particles bg — pointer-events-none so it doesn't block clicks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [-10, 10], opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 3 + Math.random() * 4, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8 z-10">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(46,139,61,0.1))', border: '1px solid rgba(212,168,67,0.2)' }}>
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Leaf size={36} className="text-accent" />
              </motion.div>
            </motion.div>
            <div className="text-center">
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl font-display font-bold text-white tracking-tight">Garden Grocer</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-white/40 text-sm mt-2 font-light tracking-wide">
                <Typewriter text="Your AI vacation kitchen concierge" delay={0.6} />
              </motion.p>
            </div>

            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }} className="mt-4 w-full max-w-sm px-8 space-y-3.5">
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => setStep('resort')}
                animate={{ boxShadow: ['0 0 20px 2px rgba(212,168,67,0.15)', '0 0 35px 8px rgba(212,168,67,0.3)', '0 0 20px 2px rgba(212,168,67,0.15)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-semibold text-[15px] relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', color: '#0D2818' }}>
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(212,168,67,0.25) 50%, transparent 60%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                />
                <Leaf size={20} />
                Talk to Grocer
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{ background: 'rgba(212,168,67,0.12)', color: 'hsl(42 55% 50%)' }}>Recommended</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => onStart('browse')}
                className="w-full py-5 rounded-2xl border font-medium text-[15px] transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.03)' }}>
                Browse Products
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 'resort' && (
          <ResortStep key="resort" onComplete={(resort) => { setTripInfo(prev => ({ ...prev, resort })); setStep('date'); }} />
        )}

        {step === 'date' && (
          <DateStep key="date" onComplete={(date) => { setTripInfo(prev => ({ ...prev, date })); setStep('guests'); }} />
        )}

        {step === 'guests' && (
          <GuestsStep key="guests" onComplete={({ adults, kids }) => {
            setTripInfo(prev => ({ ...prev, adults, kids }));
            onStart('grocer');
          }} />
        )}
      </AnimatePresence>

      {/* Progress dots */}
      {step !== 'welcome' && (
        <div className="absolute bottom-8 flex gap-2 z-10">
          {['resort', 'date', 'guests'].map((s, i) => (
            <div key={s} className={`w-1.5 h-1.5 rounded-full transition-colors ${
              ['resort', 'date', 'guests'].indexOf(step) >= i ? 'bg-accent' : 'bg-white/15'}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('grocer');

  const handleStart = (mode: string) => {
    setActiveTab(mode);
    setShowSplash(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AnimatePresence>
        {showSplash && <SplashScreen onStart={handleStart} />}
      </AnimatePresence>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'grocer' && <ConciergeScreen onViewCart={() => setActiveTab('cart')} />}
        {activeTab === 'browse' && <BrowseScreen />}
        {activeTab === 'cart' && <CartScreen onTalkToGrocer={() => setActiveTab('grocer')} onCheckout={() => setActiveTab('checkout')} />}
        {activeTab === 'checkout' && <CheckoutScreen onBack={() => setActiveTab('cart')} onComplete={() => setActiveTab('grocer')} />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'account' && <AccountScreen />}
      </div>

      {!showSplash && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
    </div>
  );
};

export default Index;
