import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, extractApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('visa-work-token');

    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        localStorage.removeItem('visa-work-token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const persistSession = (response) => {
    localStorage.setItem('visa-work-token', response.token);
    setUser(response.user);
    return response;
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials).catch((error) => {
      throw new Error(extractApiError(error, 'فشل تسجيل الدخول.'));
    });

    return persistSession(response);
  };

  const completeInitialSetup = async (payload) => {
    const response = await authApi.initialSetup(payload).catch((error) => {
      throw new Error(extractApiError(error, 'فشل إنشاء حساب المدير.'));
    });

    return persistSession(response);
  };

  const logout = async () => {
    localStorage.removeItem('visa-work-token');
    setUser(null);

    try {
      await authApi.logout();
    } catch (error) {
      return null;
    }

    return null;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      completeInitialSetup,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
