import React, { useState, useCallback, useEffect } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User, Permission } from '@types/index';
import { login, register as registerService } from '../services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from storage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await login(email, password);

      setToken(response.token);
      const userData: User = {
        id: 0, // Will be set from API response
        name: response.name,
        email,
        roles: response.roles,
        permissions: response.permissions,
      };
      setUser(userData);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registerService(name, email, password);

      setToken(response.token);
      const userData: User = {
        id: 0,
        name: response.name,
        email,
        roles: response.roles,
        permissions: response.permissions,
      };
      setUser(userData);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  }, [user]);

  const hasPermission = useCallback(
    (moduleKey: string, action: 'view' | 'add' | 'edit' | 'delete'): boolean => {
      const permission = user?.permissions.find(p => p.moduleKey === moduleKey);
      if (!permission) return false;
      return permission[`can${action.charAt(0).toUpperCase() + action.slice(1)}`];
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login: handleLogin,
    register,
    logout,
    clearError,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}