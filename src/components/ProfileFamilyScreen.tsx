import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Plus, X, Wheat, Milk, Egg, Fish, TreePine, Shell, AlertTriangle, Leaf, Baby, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

/* ─── localStorage helpers ─── */
const STORAGE_KEY_PREFIX = 'gg_profile_';

function loadLocal<T>(userId: number | string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(userId: number | string, key: string, value: T): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}_${key}`, JSON.stringify(value));
  } catch {
    // storage full — silently ignore
  }
}

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬', desc: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾', desc: 'No wheat, barley, rye' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛', desc: 'No milk products' },
  { id: 'keto', label: 'Keto', emoji: '🥑', desc: 'Low carb, high fat' },
  { id: 'paleo', label: 'Paleo', emoji: '🍖', desc: 'Whole foods only' },
  { id: 'organic', label: 'Organic Only', emoji: '🌿', desc: 'Prefer organic products' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️', desc: 'Kosher certified' },
  { id: 'halal', label: 'Halal', emoji: '☪️', desc: 'Halal certified' },
  { id: 'pescatarian', label: 'Pescatarian', emoji: '🐟', desc: 'Fish but no meat' },
];

const ALLERGEN_OPTIONS = [
  { id: 'peanuts', label: 'Peanuts', icon: '🥜', severity: 'common' },
  { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰', severity: 'common' },
  { id: 'milk', label: 'Milk', icon: '🥛', severity: 'common' },
  { id: 'eggs', label: 'Eggs', icon: '🥚', severity: 'common' },
  { id: 'wheat', label: 'Wheat', icon: '🌾', severity: 'common' },
  { id: 'soy', label: 'Soy', icon: '🫘', severity: 'common' },
  { id: 'fish', label: 'Fish', icon: '🐟', severity: 'common' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦐', severity: 'common' },
  { id: 'sesame', label: 'Sesame', icon: '🫘', severity: 'common' },
  { id: 'gluten', label: 'Gluten', icon: '🍞', severity: 'sensitivity' },
  { id: 'corn', label: 'Corn', icon: '🌽', severity: 'sensitivity' },
  { id: 'sulfites', label: 'Sulfites', icon: '🍷', severity: 'sensitivity' },
];

interface FamilyMember {
  id: string;
  name: string;
  type: 'adult' | 'child';
  dietary: string[];
  allergens: string[];
}

interface ProfileFamilyScreenProps {
  onBack: () => void;
}

const ProfileFamilyScreen = ({ onBack }: ProfileFamilyScreenProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dietary' | 'allergens' | 'family'>('dietary');
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberType, setNewMemberType] = useState<'adult' | 'child'>('adult');

  const loadProfile = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setDietary(loadLocal<string[]>(user.id, 'dietary', []));
    setAllergens(loadLocal<string[]>(user.id, 'allergens', []));
    setFamilyMembers(loadLocal<FamilyMember[]>(user.id, 'family_members', []));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const toggleDietary = (id: string) => {
    if (!user) return;
    const next = dietary.includes(id) ? dietary.filter(d => d !== id) : [...dietary, id];
    setDietary(next);
    saveLocal(user.id, 'dietary', next);
  };

  const toggleAllergen = (id: string) => {
    if (!user) return;
    const next = allergens.includes(id) ? allergens.filter(a => a !== id) : [...allergens, id];
    setAllergens(next);
    saveLocal(user.id, 'allergens', next);
  };

  const addFamilyMember = () => {
    if (!user || !newMemberName.trim()) return;
    const member: FamilyMember = {
      id: crypto.randomUUID(),
      name: newMemberName.trim(),
      type: newMemberType,
      dietary: [],
      allergens: [],
    };
    const next = [...familyMembers, member];
    setFamilyMembers(next);
    saveLocal(user.id, 'family_members', next);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const removeFamilyMember = (id: string) => {
    if (!user) return;
    const next = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(next);
    saveLocal(user.id, 'family_members', next);
  };

  const toggleMemberDietary = (memberId: string, dietId: string) => {
    if (!user) return;
    const next = familyMembers.map(m => {
      if (m.id !== memberId) return m;
      const d = m.dietary.includes(dietId) ? m.dietary.filter(x => x !== dietId) : [...m.dietary, dietId];
      return { ...m, dietary: d };
    });
    setFamilyMembers(next);
    saveLocal(user.id, 'family_members', next);
  };

  const toggleMemberAllergen = (memberId: string, allergenId: string) => {
    if (!user) return;
    const next = familyMembers.map(m => {
      if (m.id !== memberId) return m;
      const a = m.allergens.includes(allergenId) ? m.allergens.filter(x => x !== allergenId) : [...m.allergens, allergenId];
      return { ...m, allergens: a };
    });
    setFamilyMembers(next);
    saveLocal(user.id, 'family_members', next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold">Profile & Family</h1>
          <p className="text-xs text-muted-foreground">Dietary preferences & allergen alerts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3">
        {[
          { id: 'dietary' as const, label: 'Diet', icon: '🥗' },
          { id: 'allergens' as const, label: 'Allergens', icon: '⚠️' },
          { id: 'family' as const, label: 'Family', icon: '👨‍👩‍👧‍👦' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'dietary' && (
            <motion.div key="dietary" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Select your dietary preferences. We'll highlight matching products and filter recommendations.
              </p>
              {DIETARY_OPTIONS.map(opt => {
                const active = dietary.includes(opt.id);
                return (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleDietary(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      active ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/20'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'allergens' && (
            <motion.div key="allergens" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-3">
              <div className="rounded-xl p-3 flex items-start gap-2.5"
                style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                <AlertTriangle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Products containing your selected allergens will be flagged with a warning. This is advisory only — always check product labels.
                </p>
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">Top 9 Allergens</p>
              <div className="grid grid-cols-3 gap-2">
                {ALLERGEN_OPTIONS.filter(a => a.severity === 'common').map(opt => {
                  const active = allergens.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAllergen(opt.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-destructive/40 bg-destructive/5'
                          : 'border-border hover:border-destructive/20'
                      }`}
                    >
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <p className="text-xs font-medium">{opt.label}</p>
                      {active && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center mx-auto mt-1.5">
                          <Check size={10} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">Sensitivities</p>
              <div className="grid grid-cols-3 gap-2">
                {ALLERGEN_OPTIONS.filter(a => a.severity === 'sensitivity').map(opt => {
                  const active = allergens.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAllergen(opt.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-accent/40 bg-accent/5'
                          : 'border-border hover:border-accent/20'
                      }`}
                    >
                      <span className="text-xl block mb-1">{opt.icon}</span>
                      <p className="text-xs font-medium">{opt.label}</p>
                      {active && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-accent flex items-center justify-center mx-auto mt-1.5">
                          <Check size={10} className="text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'family' && (
            <motion.div key="family" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                Add family members to track individual dietary needs and allergens for your group.
              </p>

              {familyMembers.map(member => (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  onRemove={() => removeFamilyMember(member.id)}
                  onToggleDietary={(dietId) => toggleMemberDietary(member.id, dietId)}
                  onToggleAllergen={(allergenId) => toggleMemberAllergen(member.id, allergenId)}
                />
              ))}

              <AnimatePresence>
                {showAddMember && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-accent/20 p-4 space-y-3 overflow-hidden"
                    style={{ background: 'rgba(212,168,67,0.03)' }}
                  >
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="Name"
                      autoFocus
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors"
                    />
                    <div className="flex gap-2">
                      {(['adult', 'child'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setNewMemberType(type)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newMemberType === type
                              ? 'bg-accent/10 text-accent border border-accent/20'
                              : 'bg-muted/50 text-muted-foreground'
                          }`}
                        >
                          {type === 'adult' ? '🧑 Adult' : '👶 Child'}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={addFamilyMember}
                        className="flex-1 py-2 rounded-lg bg-accent text-white text-sm font-semibold flex items-center justify-center gap-1">
                        <Check size={14} /> Add
                      </button>
                      <button onClick={() => { setShowAddMember(false); setNewMemberName(''); }}
                        className="py-2 px-4 rounded-lg bg-muted/50 text-sm font-medium flex items-center justify-center gap-1">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showAddMember && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAddMember(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-accent/30 text-sm font-medium text-accent flex items-center justify-center gap-2 hover:bg-accent/5 transition-colors"
                >
                  <UserPlus size={16} /> Add Family Member
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── Family Member Card ─── */
const FamilyMemberCard = ({
  member,
  onRemove,
  onToggleDietary,
  onToggleAllergen,
}: {
  member: FamilyMember;
  onRemove: () => void;
  onToggleDietary: (id: string) => void;
  onToggleAllergen: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3.5 flex items-center gap-3 text-left"
      >
        <span className="text-lg">{member.type === 'child' ? '👶' : '🧑'}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">
            {member.dietary.length} diets · {member.allergens.length} allergens
          </p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center">
          <Trash2 size={12} className="text-destructive" />
        </button>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Dietary</p>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onToggleDietary(opt.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      member.dietary.includes(opt.id)
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>

              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground pt-1">Allergens</p>
              <div className="flex flex-wrap gap-1.5">
                {ALLERGEN_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onToggleAllergen(opt.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      member.allergens.includes(opt.id)
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileFamilyScreen;
