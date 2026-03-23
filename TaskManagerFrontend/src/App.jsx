// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext'; // Fixed typo from 'Proivider'
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import MainLayout from './components/layout/MainLayout'; // ADDED

// Pages
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import AdminPage from './pages/AdminPage';

export default function App() {
	return (
		<BrowserRouter>
			<ToastProvider>
				<AuthProvider>
					<AppContent />
				</AuthProvider>
			</ToastProvider>
		</BrowserRouter>
	);
}

function AppContent() {
	return (
		<Routes>
			{/* 1. PUBLIC ROUTE: No Sidebar, No Topbar */}
			<Route path="/login" element={<LoginPage />} />

			{/* 2. PROTECTED ROUTES: Shared Layout (Sidebar + Topbar) */}
			{/* We wrap the entire Group in a ProtectedRoute and the MainLayout */}
			<Route
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				{/* These "Child" routes will be rendered inside the MainLayout's <Outlet /> */}
				<Route path="/tasks" element={<TasksPage />} />

				{/* Nested role check can still be applied at the page level or route level */}
				<Route path="/admin" element={
					<ProtectedRoute requiredRole="admin">
						<AdminPage />
					</ProtectedRoute>
				} />
			</Route>

			{/* 3. DEFAULT REDIRECT */}
			<Route path="*" element={<Navigate to="/tasks" replace />} />
		</Routes>
	);
}