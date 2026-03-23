// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import AdminPage from './pages/AdminPage';
import { ToastProivider } from './context/ToastContext';

export default function App() {
	return (
		<BrowserRouter>
			<ToastProivider>
				<AuthProvider>
					<Routes>
						{/* Public route */}
						<Route path="/login" element={<LoginPage />} />

						{/* Protected route — requires login */}
						<Route path="/tasks" element={
							<ProtectedRoute>
								<TasksPage />
							</ProtectedRoute>
						} />

						<Route path="/admin" element={
							<ProtectedRoute requiredRole="admin">
								<AdminPage />
							</ProtectedRoute>
						} />

						{/* Default → redirect to tasks */}
						<Route path="*" element={<Navigate to="/tasks" replace />} />
					</Routes>
				</AuthProvider>
			</ToastProivider>
		</BrowserRouter>
	);
}