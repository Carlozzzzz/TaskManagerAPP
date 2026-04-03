# React Cleanup & Capacitor-Ready Guide

**Goal:** Transform your React frontend into a clean, type-safe, maintainable codebase that's ready for multi-platform deployment with Capacitor.

---

## PHASE 1: TypeScript Migration

### Step 1: Initialize TypeScript

```bash
cd TaskManagerFrontend

# Install TypeScript and types
npm install --save-dev typescript @types/react @types/react-dom @types/node

# Create tsconfig.json
npx tsc --init --strict --lib esnext --jsx react-jsx --moduleResolution bundler
```

### Step 2: Update tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForGetters": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@common/*": ["src/features/common/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.app.json" }]
}
```

### Step 3: Rename Files to .tsx/.ts

```bash
# Rename all .jsx files to .tsx (except tests)
find src -name "*.jsx" -type f ! -name "*.test.jsx" | while read f; do mv "$f" "${f%.*}.tsx"; done

# Rename utility .js files to .ts
find src -name "*.js" -type f ! -name "*.test.js" | while read f; do mv "$f" "${f%.*}.ts"; done
```

### Step 4: Update main.jsx → main.tsx

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 5: Update vite.config.js → vite.config.ts

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@common': path.resolve(__dirname, './src/features/common'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
})
```

### Step 6: Create Global Type Definitions

```typescript
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: Permission[];
}

export interface Permission {
  moduleKey: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  roles: string[];
  permissions: Permission[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## PHASE 2: Context with TypeScript

### Update AuthContext

```typescript
// src/features/auth/context/AuthContext.ts
import { createContext } from 'react';
import type { User, Permission } from '@types/index';

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
```

### Update AuthProvider

```tsx
// src/features/auth/context/AuthProvider.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User, Permission } from '@types/index';
import { loginUser, registerUser } from '../services/authService';

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

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginUser(email, password);

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

      const response = await registerUser(name, email, password);

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
    login,
    register,
    logout,
    clearError,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Update useAuth Hook

```typescript
// src/features/auth/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## PHASE 3: Validation with Zod

### Install Zod (or keep FluentValidation on backend)

```bash
npm install zod @hookform/resolvers react-hook-form
```

### Create Validation Schemas

```typescript
// src/features/auth/schemas/authSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Email must be valid'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title cannot exceed 50 characters'),
  description: z
    .string()
    .max(200, 'Description cannot exceed 200 characters')
    .optional(),
  dueDate: z
    .string()
    .refine((date) => new Date(date) > new Date(), 'Due date cannot be in the past'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
```

### Use in Component with react-hook-form

```tsx
// src/features/auth/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@common/hooks/useToast';
import Input from '@common/components/ui/Input';
import Button from '@common/components/ui/Button';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      toast('Login successful!', 'success');
    } catch (err) {
      toast(error || 'Login failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('email')}
          type="email"
          placeholder="Email"
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          aria-invalid={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

## PHASE 4: Error Boundary

### Create Error Boundary Component

```tsx
// src/features/common/components/shared/ErrorBoundary.tsx
import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({ errorInfo });

    // Log to error reporting service
    console.error('Error Boundary caught:', error, errorInfo);

    // TODO: Send to monitoring service (e.g., Sentry)
    // reportToErrorTracking(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-3">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-center text-xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-center text-gray-600 mb-6">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 rounded bg-red-50 p-3 text-sm text-red-800 max-h-48 overflow-y-auto">
                  <summary className="cursor-pointer font-semibold">Error Details</summary>
                  <pre className="mt-2 text-xs whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <button
                onClick={this.handleReset}
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = '/tasks')}
                className="mt-2 w-full rounded bg-gray-200 py-2 text-gray-900 hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Wrap App with Error Boundary

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthProvider';
import { ToastProvider } from './features/common/context/ToastProvider';
import { LoadingProvider } from './features/common/context/LoadingProvider';
import { ConfirmProvider } from './features/common/context/ConfirmProvider';
import { ErrorBoundary } from './features/common/components/shared/ErrorBoundary';
import { AxiosInterceptor } from './features/common/components/layout/AxiosInterceptor';

import ProtectedRoute from './features/auth/components/ProtectedRoute';
import MainLayout from './features/common/components/layout/MainLayout';

import LoginPage from './features/auth/pages/LoginPage';
import AdminPage from './features/admin/pages/AdminPage';
import TasksPage from './features/tasks/pages/TasksPage';
import LoadingSpinner from './features/common/components/shared/LoadingSpinner';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LoadingProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                <LoadingSpinner />
                <AxiosInterceptor>
                  <AppContent />
                </AxiosInterceptor>
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}
```

---

## PHASE 5: Capacitor Setup

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init

# When prompted:
# Name: TaskManager
# Package ID: com.taskmanager.app
# Web asset dir: dist
```

### Step 2: Generate Native Projects

```bash
# Build web first
npm run build

# Add iOS
npx cap add ios

# Add Android
npx cap add android
```

### Step 3: Create Capacitor Config

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskmanager.app',
  appName: 'TaskManager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Keyboard: {
      resize: 'body',
    },
  },
};

export default config;
```

### Step 4: Platform-Aware Storage Service

```typescript
// src/features/common/services/storageService.ts
import { Preferences } from '@capacitor/preferences';

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    // Use Capacitor on mobile, localStorage on web
    if (this.isCapacitorAvailable()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (this.isCapacitorAvailable()) {
      const { value } = await Preferences.get({ key });
      return value;
    } else {
      return localStorage.getItem(key);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.isCapacitorAvailable()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  private isCapacitorAvailable(): boolean {
    return (window as any).Capacitor !== undefined;
  }
}

export const storageService = new StorageService();
```

### Step 5: Update Auth to Use Storage Service

```tsx
// src/features/auth/context/AuthProvider.tsx (updated)
import { storageService } from '@common/services/storageService';

// Replace localStorage calls with:
await storageService.setItem('token', response.token);
await storageService.setItem('user', JSON.stringify(userData));

const savedToken = await storageService.getItem('token');
const savedUser = await storageService.getItem('user');
```

---

## PHASE 6: Updated App Structure with TypeScript & Capacitor

```
TaskManagerFrontend/
├── src/
│   ├── types/
│   │   └── index.ts                    (Global type definitions)
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx       (TypeScript version)
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── services/
│   │   │   │   └── authService.ts      (TypeScript)
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts          (TypeScript)
│   │   │   ├── schemas/
│   │   │   │   └── authSchemas.ts      (Zod validation)
│   │   │   └── context/
│   │   │       ├── AuthContext.ts
│   │   │       └── AuthProvider.tsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   │       └── task.types.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   └── common/
│   │       ├── components/
│   │       │   ├── ui/                 (Typed Button, Input, etc.)
│   │       │   ├── layout/
│   │       │   │   ├── MainLayout.tsx
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   ├── Topbar.tsx
│   │       │   │   └── AxiosInterceptor.tsx
│   │       │   └── shared/
│   │       │       ├── ErrorBoundary.tsx ✨ NEW
│   │       │       ├── LoadingSpinner.tsx
│   │       │       ├── Toast.tsx
│   │       │       └── Confirm.tsx
│   │       ├── context/
│   │       │   ├── ToastContext.ts
│   │       │   ├── ToastProvider.tsx
│   │       │   ├── LoadingContext.ts
│   │       │   ├── LoadingProvider.tsx
│   │       │   ├── ConfirmContext.ts
│   │       │   └── ConfirmProvider.tsx
│   │       ├── services/
│   │       │   ├── apiClient.ts        (TypeScript)
│   │       │   ├── storageService.ts   ✨ Capacitor-aware
│   │       │   ├── errorHandler.ts
│   │       │   └── deviceService.ts    ✨ NEW Capacitor APIs
│   │       ├── hooks/
│   │       │   ├── useToast.ts
│   │       │   ├── useLoading.ts
│   │       │   ├── useConfirm.ts
│   │       │   ├── useFetch.ts
│   │       │   └── useCapacitorStatus.ts ✨ NEW
│   │       ├── utils/
│   │       │   ├── validation.ts
│   │       │   ├── formatting.ts
│   │       │   ├── constants.ts
│   │       │   ├── helpers.ts
│   │       │   └── api.constants.ts
│   │       ├── types/
│   │       │   └── common.types.ts
│   │       └── styles/
│   │           ├── tailwind.utils.ts
│   │           └── globals.css
│   │
│   ├── App.tsx                         (Wrapped with ErrorBoundary)
│   ├── main.tsx
│   ├── index.css
│   └── App.css
│
├── public/
│   └── (static assets)
│
├── capacitor.config.ts                 ✨ NEW
├── ios/                                ✨ NEW (Capacitor)
├── android/                            ✨ NEW (Capacitor)
│
├── vite.config.ts                      (Updated - was .js)
├── tsconfig.json                       ✨ NEW
├── tsconfig.app.json                   ✨ NEW
├── .eslintrc.cjs                       (Updated for TypeScript)
├── package.json
└── README.md
```

---

## PHASE 7: Implementation Checklist

### TypeScript Setup
- [ ] Install TypeScript & types
- [ ] Create tsconfig.json
- [ ] Rename .jsx → .tsx
- [ ] Rename .js → .ts
- [ ] Add global type definitions
- [ ] Update import paths to use aliases
- [ ] Enable strict mode

### Context & Hooks
- [ ] Update AuthContext to TypeScript
- [ ] Update AuthProvider with types
- [ ] Update all custom hooks with types
- [ ] Fix any type errors
- [ ] Test context functionality

### Validation
- [ ] Install Zod & react-hook-form
- [ ] Create validation schemas
- [ ] Update forms to use react-hook-form
- [ ] Add error message display
- [ ] Test validation flows

### Error Boundary
- [ ] Create ErrorBoundary component
- [ ] Wrap App component
- [ ] Test with intentional error
- [ ] Add error logging
- [ ] Style error fallback UI

### Capacitor
- [ ] Install Capacitor packages
- [ ] Run `cap init`
- [ ] Create capacitor.config.ts
- [ ] Add iOS and Android projects
- [ ] Create platform-aware storage service
- [ ] Test on iOS simulator
- [ ] Test on Android emulator

---

## Commands to Run (In Order)

```bash
# Phase 1: TypeScript
npm install --save-dev typescript @types/react @types/react-dom @types/node
npx tsc --init --strict --lib esnext --jsx react-jsx --moduleResolution bundler

# Phase 3: Validation
npm install zod @hookform/resolvers react-hook-form

# Phase 5: Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/preferences @capacitor/keyboard
npx cap init
npm run build
npx cap add ios
npx cap add android

# Test builds
npm run build
npx cap sync
npx cap open ios    # Opens Xcode
npx cap open android # Opens Android Studio
```

---

## Testing Each Phase

```bash
# Phase 1: TypeScript validation
npm run build  # Should compile with no errors

# Phase 3: Validation testing
npm run dev    # Test login/register forms

# Phase 4: Error Boundary
# Uncomment the error in a component to test

# Phase 5: Capacitor
npx cap sync   # Syncs web assets to native projects
npm run build && npx cap sync
```
