import apiClient from './apiClient';

export const roleService = {
	getAll: () => apiClient.get('/Roles').then(res => res.data),
	getAllWithPermissions: () => apiClient.get('/Roles/with-role-permissions').then(res => res.data),
	getById: (id) => apiClient.get(`/Roles/${id}`).then(res => res.data),
	getByIdWithPermissions: (id) => apiClient.get(`/Roles/${id}/with-role-permissions`).then(res => res.data),
	create: (data) => apiClient.post('/Roles', data).then(res => res.data),
	update: (id, data) => apiClient.put(`/Roles/${id}`, data).then(res => res.data), // ADDED
	delete: (id) => apiClient.delete(`/Roles/${id}`).then(res => res.data)
};