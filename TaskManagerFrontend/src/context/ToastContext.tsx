// src/context/ToastContext.tsx
import { createContext } from 'react';

export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);