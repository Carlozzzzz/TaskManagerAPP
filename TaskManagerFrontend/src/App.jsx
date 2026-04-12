// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AxiosInterceptor } from './components/layout/AxiosInterceptor';
import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastProvider';
import { LoadingProvider } from './context/LoadingProvider';
import { ConfirmProvider } from './context/ConfirmProvider';

import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TasksPage from './pages/TasksPage';
import CompanyPage from './pages/Maintenance/CompanyPage';
import ClientPage from './pages/ClientPage';
import DepartmentPage from './pages/DepartmentPage';
import HomePage from './pages/HomePage';

export default function App() {
	return (
		<BrowserRouter>
			<LoadingProvider>
				<ToastProvider>
					<ConfirmProvider>
						<AuthProvider>
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
				<Route path="/dashboard" element={<HomePage />} />
				<Route path="/tasks" element={<TasksPage />} />
				<Route path="/client" element={<ClientPage />} />
				<Route path="/department" element={<DepartmentPage />} />
				<Route path="/company" element={<CompanyPage />} />

				{/* Nested role check can still be applied at the page level or route level */}
				<Route path="/admin" element={
					<ProtectedRoute requiredRole="Admin">
						<AdminPage />
					</ProtectedRoute>
				} />
			</Route>

			{/* 3. DEFAULT REDIRECT */}
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}