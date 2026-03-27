import { User, Heart, Shield, Gift, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: User, label: 'Profile & Family', desc: 'Dietary profiles, allergies' },
  { icon: Heart, label: 'Favorites', desc: 'Your saved products' },
  { icon: Shield, label: 'Allergy Guard', desc: 'Set alerts for allergens' },
  { icon: Gift, label: 'Refer a Friend', desc: 'Give $10, Get $10' },
];

const AccountScreen = () => (
  <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
    <h1 className="text-2xl font-display font-bold mb-6">Account</h1>

    <div className="grocer-input-card flex items-center gap-4 mb-6">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <User size={24} className="text-primary" />
      </div>
      <div>
        <p className="font-semibold">Guest User</p>
        <p className="text-sm text-muted-foreground">Sign in for a personalized experience</p>
      </div>
    </div>

    <div className="space-y-2">
      {menuItems.map(item => (
        <button key={item.label} className="w-full grocer-input-card flex items-center gap-3">
          <item.icon size={20} className="text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      ))}
    </div>
  </div>
);

export default AccountScreen;
