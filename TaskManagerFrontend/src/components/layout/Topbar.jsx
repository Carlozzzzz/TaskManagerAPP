// src/components/layout/Topbar.jsx
import { useAuth } from '../../hooks/useAuth';

export default function Topbar() {
	const { user, logout } = useAuth();

	return (
		<header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6 shadow-sm">
			<div className="flex items-center gap-4">
				{user?.role === 'admin' && (
					<span className="... bg-purple-100 text-xs text-purple-600">Admin</span>
				)}
				<span className="text-sm text-gray-500">
					Hi, <span className="font-medium text-gray-700">{user?.name}</span>
				</span>
				<button
					onClick={logout}
					className="text-sm font-medium text-red-400 transition-colors hover:text-red-600"
				>
					Logout
				</button>
			</div>
		</header>
	);
}