import { Home, Search, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: 'grocer', label: 'Grocer', icon: Home },
  { id: 'browse', label: 'Browse', icon: Search },
  { id: 'cart', label: 'Cart', icon: ShoppingCart },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'account', label: 'Account', icon: User },
];

const BottomNav = ({ active, onNavigate }: BottomNavProps) => {
  const totalItems = useCartStore(s => s.totalItems());

  return (
    <nav className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-card border-t border-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`grocer-nav-item ${active === tab.id ? 'active' : ''}`}
        >
          <div className="relative">
            <tab.icon size={22} />
            {tab.id === 'cart' && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center text-secondary-foreground">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[11px]">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
