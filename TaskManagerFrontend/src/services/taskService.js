// src/services/taskService.js
import apiClient from './apiClient';

export const getAllTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const getCurrentUserTasks = async () => {
  const response = await apiClient.get('/tasks/user-tasks');
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (title, description, dueDate) => {
  const response = await apiClient.post('/tasks', { title, description, dueDate });
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
	const response = await apiClient.put(`/tasks/update-status/${id}`, { status });
	return response.data;
}

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};