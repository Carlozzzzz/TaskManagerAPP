// src/services/taskService.js
import apiClient from './apiClient';

export const taskService = {
	getAllTasks: async () => {
		const response = await apiClient.get('/tasks');
		return response.data;
	},
	getCurrentUserTasks: async () => {
		const response = await apiClient.get('/tasks/user-tasks');
		return response.data;
	},
	getTaskById: async (id) => {
		const response = await apiClient.get(`/tasks/${id}`);
		return response.data;
	},
	create: async (title, description, dueDate) => {
		const response = await apiClient.post('/tasks', { title, description, dueDate });
		return response.data;
	},
	updateStatus: async (id, status) => {
		const response = await apiClient.put(`/tasks/update-status/${id}`, { status });
		return response.data;
	},
	delete: async (id) => {
		const response = await apiClient.delete(`/tasks/${id}`);
		return response.data;
	}
}