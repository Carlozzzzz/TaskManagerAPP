// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // ADDED — wait for localStorage check before deciding to redirect
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Loading...
    </div>
  );

  // Not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

	// Logged in, but wrong role -> go back to tasks
	if (requiredRole && !user.roles.includes(requiredRole)) {
		return <Navigate to="/tasks" replace />;
	}

  return children;
}