import { motion, AnimatePresence } from 'framer-motion';
import { Wine, ShieldCheck } from 'lucide-react';

interface AgeVerificationModalProps {
  open: boolean;
  onVerified: () => void;
  onDeclined: () => void;
}

const AgeVerificationModal = ({ open, onVerified, onDeclined }: AgeVerificationModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: 'linear-gradient(180deg, rgba(10,5,15,0.95) 0%, rgba(30,15,40,0.92) 100%)' }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-sm rounded-3xl p-8 text-center space-y-6"
            style={{
              background: 'linear-gradient(160deg, rgba(30,20,40,0.95), rgba(20,15,30,0.98))',
              border: '1px solid rgba(212,168,67,0.25)',
              boxShadow: '0 0 60px rgba(212,168,67,0.12), 0 25px 50px rgba(0,0,0,0.5)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))',
                border: '1px solid rgba(212,168,67,0.3)',
              }}
            >
              <Wine size={28} className="text-accent" />
            </motion.div>

            <div>
              <h2 className="text-xl font-display font-bold text-accent mb-2">
                Age Verification Required
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                You must be 21 or older to view and purchase alcoholic beverages
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onVerified}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(130 54% 23%), hsl(130 40% 35%))',
                  color: 'white',
                }}
              >
                <ShieldCheck size={16} />
                I am 21 or older — Continue
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onDeclined}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'transparent',
                }}
              >
                I am under 21 — Go Back
              </motion.button>
            </div>

            <p className="text-[10px] text-white/30 leading-relaxed">
              By clicking "Continue", you confirm that you are of legal drinking age in your state of residence.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerificationModal;
