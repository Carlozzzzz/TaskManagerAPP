// src/context/AuthContext.jsx
import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { AuthContext } from './AuthContext';
import { useConfirm } from '../hooks/useConfirm';


export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);   // { name, role }
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	const { showToast } = useToast();
	const { askConfirm } = useConfirm();

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

	const logout = async () => {

		const isOk = await askConfirm({
			title: 'Are you sure?',
			message: 'Do you really want to log out?',
			type: 'warning'
		});
		
		if (!isOk) return;

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