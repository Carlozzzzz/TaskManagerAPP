// src/features/auth/context/AuthContext.ts
import { createContext } from 'react';
import type { User, PermissionDto } from '@types/index';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (moduleKey: string, action: 'view' | 'add' | 'edit' | 'delete') => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);