import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, AuthContextType } from '../types';
import { authAPI } from '../api/endpoints';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);

      if (response.data.success) {
        const userData = response.data.data;
        
        setUser(userData);
        setToken('session_active');
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'session_active');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup(name, email, password, role);

      if (response.data.success) {
        const userData = response.data.data;
        
        setUser(userData);
        setToken('session_active');
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'session_active');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authAPI.logout().catch(() => {
    });

    setUser(null);
    setToken(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
