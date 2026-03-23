// src/services/adminService.js
import api from './api';

// ADDED — admin only API calls
export const getAllTasksAdmin = async () => {
  const response = await api.get('/admin/tasks');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};