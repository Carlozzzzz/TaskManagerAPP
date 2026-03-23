// src/services/api.js
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5154/api', // ← change port to match your API
});

// ADDED — intercept every request and attach token if it exists
api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ADDED — intercept every response, if 401 → clear token and redirect to login
api.interceptors.response.use(
	response => response,
	error => {
		// MODIFIED — Only redirect if it's a 401 AND NOT a login/register attempt
		const isAuthRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');

		if (error.response?.status === 401 && !isAuthRequest) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;