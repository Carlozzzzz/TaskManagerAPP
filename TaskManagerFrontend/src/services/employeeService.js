// MODIFIED: Standardized ERP Service
import apiClient from "./apiClient";

export const employeeService = {
	getAll: async () => {
		const response = await apiClient.get('/Employee');
		return response.data;
	},
	getById: async (id) => {
		const response = await apiClient.get(`/Employee/${id}`);
		return response.data;
	},
	create: async (data) => {
		const response = await apiClient.post('/Employee', data);
		return response.data;
	},
	update: async (id, data) => {
		const response = await apiClient.put(`/Employee/${id}`, data);
		return response.data;
	},
	delete: async (id) => {
		const response = await apiClient.delete(`/Employee/${id}`);
		return response.data;
	}
};