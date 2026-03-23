// src/services/api.js
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5154/api',
});

// 1. Create a placeholder for the logout function
let logoutHandler = null;

// 2. Export a function to "inject" the real logout logic later
export const injectLogout = (fn) => {
	logoutHandler = fn;
};

api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	res => res,
	error => {
		// 3. If we get a 401 (Unauthorized) and it's not the login page itself
		if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
			if (logoutHandler) {
				// 4. Call the injected React logout function!
				// This will trigger the toast and redirect automatically.
				logoutHandler();
			} else {
				// Fallback if injection hasn't happened yet
				localStorage.clear();
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default api;