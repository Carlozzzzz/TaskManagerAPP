// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastProvider'; // Fixed typo from 'Proivider'
import { LoadingProvider } from './context/LoadingProvider';

import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './components/layout/MainLayout'; // ADDED

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TasksPage from './pages/TasksPage';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { ConfirmProvider } from './context/ConfirmProvider';
import { AxiosInterceptor } from './components/layout/AxiosInterceptor';

export default function App() {
	return (
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