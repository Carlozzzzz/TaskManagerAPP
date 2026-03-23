// src/services/taskService.js
import api from './api';

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (title, description, dueDate) => {
  const response = await api.post('/tasks', { title, description, dueDate });
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
	const response = await api.put(`/tasks/update-status/${id}`, { status });
	return response.data;
}

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};