// src/components/layout/AxiosInterceptor.jsx
import { useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const AxiosInterceptor = ({ children }) => {
	const { logout } = useAuth();
	const { showToast } = useToast();

	useEffect(() => {
		// ADDED: Response Interceptor
		const responseInterceptor = apiClient.interceptors.response.use(
			(response) => response,
			(error) => {
				const status = error.response?.status;

				// Handle 401 Unauthorized (Expired/Invalid Token)
				if (status === 401) {
					// Prevent infinite loop if login fails
					if (!error.config.url.includes('/auth/login')) {
						showToast("Session expired. Please log in again.", "error");
						logout({ forced: true });
					}
				}

				// Handle 500 Global Server Errors (from your .NET Middleware)
				if (status === 500) {
					showToast("Internal Server Error. Please contact support.", "error");
				}

				// Handle Network Errors (Server is down)
				if (!error.response) {
					showToast("Network error. Check your connection.", "error");
				}

				return Promise.reject(error);
			}
		);

		// CLEANUP: Remove interceptor when component unmounts
		return () => apiClient.interceptors.response.eject(responseInterceptor);
	}, [logout, showToast]);

	return children;
};