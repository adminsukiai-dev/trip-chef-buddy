import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ConciergeScreen from '@/pages/ConciergeScreen';
import BrowseScreen from '@/pages/BrowseScreen';
import CartScreen from '@/pages/CartScreen';
import OrdersScreen from '@/pages/OrdersScreen';
import AccountScreen from '@/pages/AccountScreen';

const SplashScreen = ({ onStart }: { onStart: (mode: string) => void }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-6"
    >
      <div className="w-20 h-20 rounded-3xl bg-primary-foreground/10 flex items-center justify-center">
        <Leaf size={40} className="text-primary-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-primary-foreground">Garden Grocer</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Your AI Personal Shopper</p>
      </div>
    </motion.div>

    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-16 w-full max-w-sm px-8 space-y-3"
    >
      <p className="text-primary-foreground/80 text-center text-sm mb-4">How would you like to shop?</p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onStart('grocer')}
        className="w-full py-4 rounded-2xl bg-primary-foreground flex items-center justify-center gap-3 font-semibold text-primary"
      >
        <Leaf size={20} />
        Talk to Grocer
        <span className="text-xs bg-secondary/20 px-2 py-0.5 rounded-full">Recommended</span>
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onStart('browse')}
        className="w-full py-4 rounded-2xl border-2 border-primary-foreground/30 text-primary-foreground font-medium"
      >
        Browse Products
      </motion.button>
    </motion.div>
  </motion.div>
);

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
        {activeTab === 'cart' && <CartScreen onTalkToGrocer={() => setActiveTab('grocer')} />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'account' && <AccountScreen />}
      </div>

      {!showSplash && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
    </div>
  );
};

export default Index;
