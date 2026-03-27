import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ShieldCheck, Upload } from 'lucide-react';

interface AlcoholIdVerificationProps {
  onComplete: (method: 'upload' | 'at-delivery') => void;
}

const AlcoholIdVerification = ({ onComplete }: AlcoholIdVerificationProps) => {
  const [method, setMethod] = useState<'upload' | 'at-delivery' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: 'rgba(212,168,67,0.06)',
        border: '1px solid rgba(212,168,67,0.2)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(212,168,67,0.12)' }}>
          <ShieldCheck size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Photo ID Required</h3>
          <p className="text-xs text-muted-foreground">Your cart contains alcoholic beverages</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Upload a photo of your valid government ID (driver's license or passport)
      </p>

      <div className="space-y-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setMethod('upload'); onComplete('upload'); }}
          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all text-sm ${
            method === 'upload' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Camera size={16} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Upload Photo ID</p>
            <p className="text-xs text-muted-foreground">Take a photo or upload from gallery</p>
          </div>
          <Upload size={14} className="text-muted-foreground" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setMethod('at-delivery'); onComplete('at-delivery'); }}
          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all text-sm ${
            method === 'at-delivery' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">I'll show my ID at delivery</p>
            <p className="text-xs text-muted-foreground">Present valid ID when receiving order</p>
          </div>
        </motion.button>
      </div>

      <p className="text-[10px] text-muted-foreground/70 leading-relaxed border-t border-border pt-3">
        ⚖️ The person who placed the order must present matching valid photo ID at delivery. 
        Orders cannot be released without ID verification.
      </p>
    </motion.div>
  );
};

export default AlcoholIdVerification;
