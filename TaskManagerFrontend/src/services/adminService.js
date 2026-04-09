// src/services/adminService.js
import apiClient from './apiClient';

// ADDED — admin only API calls
export const getAllTasksAdmin = async () => {
  const response = await apiClient.get('/admin/tasks');
  return response.data;
};