import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  isPermanentFree: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('ca_auth_token');
      if (!token) {
        // Auto-login with default student for seamless first experience
        const res = await api.login('student@example.com', 'STUDENT');
        localStorage.setItem('ca_auth_token', res.token);
        setUser(res.user);
        return;
      }
      const res = await api.getMe();
      setUser(res.user);
    } catch (err) {
      console.warn('Auth session expired or invalid:', err);
      try {
        const res = await api.login('student@example.com', 'STUDENT');
        localStorage.setItem('ca_auth_token', res.token);
        setUser(res.user);
      } catch (loginErr) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, role?: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, role);
      localStorage.setItem('ca_auth_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('ca_auth_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ca_auth_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    let email = 'student@example.com';
    if (targetRole === 'INSTITUTE_ADMIN') email = 'institute@example.com';
    if (targetRole === 'SUPER_ADMIN' || targetRole === 'ADMIN') email = 'admin@example.com';
    await login(email, targetRole);
  };

  const isPermanentFree = Boolean(user?.isPermanentFree);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        switchRole,
        isPermanentFree,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
