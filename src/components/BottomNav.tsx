import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

/* Custom SVG icons for premium feel */
const GrocerIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" />
    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    <circle cx="14" cy="10" r="1.5" fill="currentColor" />
    <path d="M9 14.5c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" />
  </svg>
);

const BrowseIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const CartIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const OrdersIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

const AccountIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-1a6 6 0 0112 0v1" />
  </svg>
);

const tabs = [
  { id: 'grocer', label: 'Grocer', Icon: GrocerIcon },
  { id: 'browse', label: 'Browse', Icon: BrowseIcon },
  { id: 'cart', label: 'Cart', Icon: CartIcon },
  { id: 'orders', label: 'Orders', Icon: OrdersIcon },
  { id: 'account', label: 'Account', Icon: AccountIcon },
];

const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  const totalItems = useCartStore(s => s.totalItems());

  return (
    <nav className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] grocer-nav-glass">
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            whileTap={{ scale: 0.9 }}
            className={`grocer-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <tab.Icon active={isActive} />
              {tab.id === 'cart' && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
