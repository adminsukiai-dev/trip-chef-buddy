import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      toast.error('Invalid or expired reset link');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setDone(true);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const inputClass =
    'w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #060E08 0%, #0D2818 40%, #143820 100%)' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(46,139,61,0.1))', border: '1px solid rgba(212,168,67,0.2)' }}>
        <Leaf size={28} className="text-accent" />
      </motion.div>

      {done ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <CheckCircle size={48} className="text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-white">Password updated!</h1>
          <p className="text-sm text-white/40 mt-2">Redirecting you now...</p>
        </motion.div>
      ) : (
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} className="w-full max-w-sm px-6 space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-white">Set new password</h1>
            <p className="text-sm text-white/40 mt-1">Choose a strong password for your account</p>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="New password" required minLength={6} className={inputClass} />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Confirm password" required minLength={6} className={inputClass} />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Updating...' : <>Update Password <ArrowRight size={16} /></>}
          </motion.button>
        </motion.form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
