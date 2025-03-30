'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, fetchCurrentUser, getCurrentUser, isAuthenticated } from '../services/auth';
import { DEV_MODE } from '../services/config';

const DEV_USER: User = {
  id: 'dev-user-123',
  email: 'dev@example.com',
  username: 'devuser',
  display_name: '开发者用户',
  avatar_url: null
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  checkAuth: async () => { },
  setUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      if (DEV_MODE) {
        setUser(DEV_USER);
        setLoading(false);
        return;
      }

      if (isAuthenticated()) {
        const localUser = getCurrentUser();
        if (localUser) {
          setUser(localUser);

          try {
            const updatedUser = await fetchCurrentUser();
            setUser(updatedUser);
          } catch (error) {
            console.warn('无法从服务器获取最新用户信息，使用本地缓存');
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '认证检查失败');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
