// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // ADDED — wait for localStorage check before deciding to redirect
  if (loading) return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Loading...
    </div>
  );

  // Not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

	// Logged in, but wrong role -> go back to tasks
	if (requiredRole && user.role !== requiredRole) {
		return <Navigate to="/tasks" replace />;
	}

  return children;
}