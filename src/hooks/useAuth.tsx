import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth as authApi, setAuthToken, getAuthToken } from '@/lib/api';

interface GGUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
  group_id: number;
}

interface AuthContextType {
  user: GGUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GGUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const savedUser = localStorage.getItem('gg_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setAuthToken(null);
        localStorage.removeItem('gg_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const [firstName, ...lastParts] = (displayName || 'Guest').split(' ');
      const lastName = lastParts.join(' ') || 'User';
      const response = await authApi.register(email, password, firstName, lastName);
      const userData: GGUser = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email || email,
        token: response.data.token,
        group_id: response.data.group_id || 3,
      };
      setUser(userData);
      localStorage.setItem('gg_user', JSON.stringify(userData));
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      const userData: GGUser = {
        id: response.data.id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email || email,
        token: response.data.token,
        group_id: response.data.group_id || 3,
      };
      setUser(userData);
      localStorage.setItem('gg_user', JSON.stringify(userData));
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Invalid email or password' };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('gg_user');
  };

  const resetPassword = async (_email: string) => {
    return { error: 'Please visit gardengrocer.com to reset your password.' };
  };

  const updatePassword = async (_password: string) => {
    return { error: 'Please visit gardengrocer.com to change your password.' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
