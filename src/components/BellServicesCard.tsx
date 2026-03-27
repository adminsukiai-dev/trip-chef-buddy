import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckSquare, Square, Info } from 'lucide-react';

interface BellServicesCardProps {
  resortName: string;
  onAcknowledge: (acknowledged: boolean) => void;
}

const BellServicesCard = ({ resortName, onAcknowledge }: BellServicesCardProps) => {
  const [acknowledged, setAcknowledged] = useState(false);

  const toggle = () => {
    const next = !acknowledged;
    setAcknowledged(next);
    onAcknowledge(next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'linear-gradient(135deg, rgba(46,139,61,0.06), rgba(212,168,67,0.04))',
        border: '1px solid rgba(46,139,61,0.2)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(46,139,61,0.12)' }}>
          <Bell size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Disney Resort Delivery</h3>
          <p className="text-xs text-muted-foreground">Bell Services at {resortName}</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
        <div className="flex gap-2.5">
          <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p>Your groceries will be delivered to Bell Services at <span className="font-medium text-foreground">{resortName}</span></p>
        </div>
        <div className="flex gap-2.5">
          <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p>When you check in, let the front desk know you have a Garden Grocer delivery</p>
        </div>
        <div className="flex gap-2.5">
          <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
          <p>You'll need to present your reservation confirmation and photo ID to pick up</p>
        </div>
        <div className="flex gap-2.5">
          <Info size={14} className="text-accent flex-shrink-0 mt-0.5" />
          <p>Cold items will be refrigerated separately by Bell Services</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={toggle}
        className="w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-sm"
        style={{
          borderColor: acknowledged ? 'hsl(130 54% 23%)' : 'hsl(var(--border))',
          background: acknowledged ? 'rgba(46,139,61,0.06)' : 'transparent',
        }}
      >
        {acknowledged ? (
          <CheckSquare size={18} className="text-primary flex-shrink-0" />
        ) : (
          <Square size={18} className="text-muted-foreground flex-shrink-0" />
        )}
        <span className={acknowledged ? 'text-foreground font-medium' : 'text-muted-foreground'}>
          I understand the Bell Services pickup process
        </span>
      </motion.button>
    </motion.div>
  );
};

export default BellServicesCard;
