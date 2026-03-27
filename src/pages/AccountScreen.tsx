import { useState } from 'react';
import { User, Heart, Shield, Gift, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/AuthPage';
import { toast } from 'sonner';

const menuItems = [
  { icon: User, label: 'Profile & Family', desc: 'Dietary profiles, allergies' },
  { icon: Heart, label: 'Favorites', desc: 'Your saved products' },
  { icon: Shield, label: 'Allergy Guard', desc: 'Set alerts for allergens' },
  { icon: Gift, label: 'Refer a Friend', desc: 'Give $10, Get $10' },
];

const AccountScreen = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && showAuth) {
    return <AuthPage />;
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden px-4 pt-4">
      <h1 className="text-2xl font-display font-bold mb-6">Account</h1>

      <div className="grocer-input-card flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          {user ? (
            <>
              <p className="font-semibold">{user.user_metadata?.display_name || user.email}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Guest User</p>
              <p className="text-sm text-muted-foreground">Sign in for a personalized experience</p>
            </>
          )}
        </div>
        {!user && (
          <button onClick={() => setShowAuth(true)}
            className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold">
            Sign In
          </button>
        )}
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

      {user && (
        <button onClick={handleSignOut}
          className="mt-auto mb-4 w-full grocer-input-card flex items-center justify-center gap-2 text-red-500 text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </button>
      )}
    </div>
  );
};

export default AccountScreen;
