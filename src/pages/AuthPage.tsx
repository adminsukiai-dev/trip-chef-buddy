import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

type AuthView = 'login' | 'signup' | 'forgot';

const AuthPage = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error(error);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, displayName);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Check your email to verify your account!');
      setView('login');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Password reset link sent to your email!');
      setView('login');
    }
  };

  const inputClass =
    'w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent/50 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060E08 0%, #0D2818 40%, #143820 100%)' }}>

      {/* Logo */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(46,139,61,0.1))', border: '1px solid rgba(212,168,67,0.2)' }}>
        <Leaf size={28} className="text-accent" />
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'login' && (
          <motion.form key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleLogin} className="w-full max-w-sm px-6 space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-white">Welcome back</h1>
              <p className="text-sm text-white/40 mt-1">Sign in to your Garden Grocer account</p>
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" required minLength={6} className={inputClass} />
            </div>
            <button type="button" onClick={() => setView('forgot')}
              className="text-xs text-accent/70 hover:text-accent transition-colors">
              Forgot password?
            </button>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </motion.button>
            <p className="text-center text-sm text-white/40">
              Don't have an account?{' '}
              <button type="button" onClick={() => setView('signup')} className="text-accent hover:underline">
                Sign up
              </button>
            </p>
          </motion.form>
        )}

        {view === 'signup' && (
          <motion.form key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSignup} className="w-full max-w-sm px-6 space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-white">Create account</h1>
              <p className="text-sm text-white/40 mt-1">Start planning your vacation groceries</p>
            </div>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="Display name" className={inputClass} />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)" required minLength={6} className={inputClass} />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
            </motion.button>
            <p className="text-center text-sm text-white/40">
              Already have an account?{' '}
              <button type="button" onClick={() => setView('login')} className="text-accent hover:underline">
                Sign in
              </button>
            </p>
          </motion.form>
        )}

        {view === 'forgot' && (
          <motion.form key="forgot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleForgot} className="w-full max-w-sm px-6 space-y-4">
            <button type="button" onClick={() => setView('login')}
              className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-2">
              <ArrowLeft size={14} /> Back to sign in
            </button>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-display font-bold text-white">Reset password</h1>
              <p className="text-sm text-white/40 mt-1">We'll send you a link to reset it</p>
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required className={inputClass} />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={16} /></>}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
