// src/components/layout/Topbar.jsx
import { useAuth } from '../../hooks/useAuth';

export default function Topbar() {
	const { user, logout } = useAuth();

	return (
		<header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-end shadow-sm">
			<div className="flex items-center gap-4">
				{user?.role === 'admin' && (
					<span className="text-xs bg-purple-100 text-purple-600 ...">Admin</span>
				)}
				<span className="text-sm text-gray-500">
					Hi, <span className="font-medium text-gray-700">{user?.name}</span>
				</span>
				<button
					onClick={logout}
					className="text-sm text-red-400 hover:text-red-600 transition-colors font-medium"
				>
					Logout
				</button>
			</div>
		</header>
	);
}