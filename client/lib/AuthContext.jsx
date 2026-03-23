import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi, user as userApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      authApi.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    await checkAuth();
    return data;
  };

  const register = async (username, email, password) => {
    return authApi.register(username, email, password);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
