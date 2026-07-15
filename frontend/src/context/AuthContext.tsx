import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { api, clearAuth, getStoredUser, saveAuth } from '@/services/api';
import type { AuthResponse } from '@/services/types';

interface AuthContextValue {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthResponse | null>(() => getStoredUser());

  const login = useCallback(async (email: string, password: string) => {
    const auth = await api.login(email, password);
    saveAuth(auth);
    setUser(auth);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const auth = await api.register(name, email, password);
    saveAuth(auth);
    setUser(auth);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
