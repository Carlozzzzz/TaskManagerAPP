// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);   // { name, role }
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	const { showToast } = useToast();

	// ADDED — on app load, check if token already exists in localStorage
	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = (data) => {
		// data = { token, name, role } from your API
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
		setToken(data.token);
		setUser({ name: data.name, role: data.role });
		showToast(`Welcome back, ${data.name}!`, 'success');
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setToken(null);
		setUser(null);
		showToast('Logged out successfully.', 'info');
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
}