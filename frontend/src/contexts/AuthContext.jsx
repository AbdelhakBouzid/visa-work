import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, extractApiError } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials).catch((error) => {
      const parsedError = new Error(extractApiError(error, 'فشل تسجيل الدخول.'));
      parsedError.response = error.response;
      throw parsedError;
    });

    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout transport failures and clear local auth state anyway.
    }

    setUser(null);
    return null;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
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
