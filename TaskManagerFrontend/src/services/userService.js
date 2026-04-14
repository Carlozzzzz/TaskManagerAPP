// src/services/userService.js
import apiClient from './apiClient';

export const userService = {
	getAllUsers: async () => {
		const response = await apiClient.get('/User/users');
		return response.data;
	},
	update: async (id, data) => {
		const response = await apiClient.put(`/User/${id}`, data);
		return response.data;
	}
}