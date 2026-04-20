// src/context/AuthContext.jsx
import { useState, useEffect, useCallback } from 'react'; // ADDED useCallback for stability
import { useToast } from '../hooks/useToast';
import { AuthContext } from './AuthContext';
import { useConfirm } from '../hooks/useConfirm';

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true); // Start at true

	const { showToast } = useToast();
	const { askConfirm } = useConfirm();

	// 1. HYDRATION LOGIC (Runs once on mount)
	useEffect(() => {
		const hydrate = () => {
			try {
				const storedToken = localStorage.getItem('token');
				const storedUser = localStorage.getItem('user');

				if (storedToken && storedUser && storedUser !== "undefined") {
					setToken(storedToken);
					setUser(JSON.parse(storedUser));
				}
			} catch (err) {
				console.error("Auth hydration failed:", err);
				localStorage.clear();
			} finally {
				// It tells the app: "I'm done checking localStorage, show the routes now."
				setLoading(false);
			}
		};

		hydrate();
	}, []);

	// 2. LOGIN LOGIC
	const login = (data) => {
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role, permissions: data.permissions }));

		setToken(data.token);
		setUser({ name: data.name, role: data.role, permissions: data.permissions });

		// ADDED: Ensure loading is false after login
		setLoading(false);

		showToast(`Welcome back, ${data.name}!`, 'success');
	};

	// 3. LOGOUT LOGIC
	const logout = async ({ forced = false } = {}) => {

		// Now 'forced' is available directly as a variable, difine nothing = false
		if (!forced) {
			const isOk = await askConfirm({
				title: 'Are you sure?',
				message: 'Do you really want to log out?',
				type: 'warning'
			});
			if (!isOk) return;
		}

		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
		setLoading(false); // Safety check

		if (forced) {
			showToast('Session expired. Please login again.', 'error');
		} else {
			showToast('Logged out successfully.', 'success');
		}
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}