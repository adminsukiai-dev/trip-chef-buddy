import { useState } from 'react';
import { User, Heart, Shield, Gift, ChevronRight, LogOut, MapPin, Users, Pencil, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTripProfile } from '@/hooks/useTripProfile';
import { ORLANDO_RESORTS } from '@/data/products';
import AuthPage from '@/pages/AuthPage';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: User, label: 'Profile & Family', desc: 'Dietary profiles, allergies' },
  { icon: Heart, label: 'Favorites', desc: 'Your saved products' },
  { icon: Shield, label: 'Allergy Guard', desc: 'Set alerts for allergens' },
  { icon: Gift, label: 'Refer a Friend', desc: 'Give $10, Get $10' },
];

/* ─── Trip Details Editor ─── */
const TripEditor = () => {
  const { savedTrip, loading, saveTripDetails } = useTripProfile();
  const [editing, setEditing] = useState(false);
  const [resort, setResort] = useState('');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [resortSearch, setResortSearch] = useState('');

  const startEditing = () => {
    setResort(savedTrip?.resort || '');
    setResortSearch(savedTrip?.resort || '');
    setAdults(savedTrip?.adults ?? 2);
    setKids(savedTrip?.kids ?? 0);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!resort) {
      toast.error('Please select a resort');
      return;
    }
    await saveTripDetails({ resort, date: '', adults, kids });
    toast.success('Trip details updated');
    setEditing(false);
  };

  if (loading) return null;

  const filtered = ORLANDO_RESORTS.filter(r =>
    r.toLowerCase().includes(resortSearch.toLowerCase())
  );

  return (
    <div className="grocer-input-card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-accent" />
          <span className="text-sm font-semibold">Trip Details</span>
        </div>
        {!editing && (
          <button onClick={startEditing} className="flex items-center gap-1 text-xs text-accent font-medium">
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!editing ? (
          <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {savedTrip?.resort ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span>{savedTrip.resort}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-muted-foreground" />
                  <span>{savedTrip.adults} adult{savedTrip.adults !== 1 ? 's' : ''}{savedTrip.kids > 0 ? `, ${savedTrip.kids} kid${savedTrip.kids !== 1 ? 's' : ''}` : ''}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No trip details saved yet. Tap Edit to add your resort and guests.</p>
            )}
          </motion.div>
        ) : (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Resort search */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Resort</label>
              <input
                type="text"
                value={resortSearch}
                onChange={e => { setResortSearch(e.target.value); setResort(''); }}
                placeholder="Search resorts..."
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50 transition-colors"
              />
              {resortSearch && !resort && (
                <div className="max-h-32 overflow-y-auto mt-1 rounded-lg border border-border bg-background">
                  {filtered.slice(0, 6).map(r => (
                    <button key={r} onClick={() => { setResort(r); setResortSearch(r); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors">
                      {r}
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground">No resorts found</p>
                  )}
                </div>
              )}
              {resort && (
                <p className="text-xs text-accent mt-1">✓ {resort}</p>
              )}
            </div>

            {/* Guest counters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Adults</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-sm font-medium">−</button>
                  <span className="text-sm font-semibold w-6 text-center">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-sm font-medium">+</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Kids</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setKids(Math.max(0, kids - 1))}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-sm font-medium">−</button>
                  <span className="text-sm font-semibold w-6 text-center">{kids}</span>
                  <button onClick={() => setKids(kids + 1)}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-sm font-medium">+</button>
                </div>
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-semibold flex items-center justify-center gap-1">
                <Check size={14} /> Save
              </button>
              <button onClick={() => setEditing(false)}
                className="py-2 px-4 rounded-lg bg-muted/50 text-sm font-medium flex items-center justify-center gap-1">
                <X size={14} /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Account Screen ─── */
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
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-20">
      <h1 className="text-2xl font-display font-bold mb-6">Account</h1>

      <div className="grocer-input-card flex items-center gap-4 mb-4">
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

      {user && <TripEditor />}

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
          className="mt-6 w-full grocer-input-card flex items-center justify-center gap-2 text-red-500 text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </button>
      )}
    </div>
  );
};

export default AccountScreen;
