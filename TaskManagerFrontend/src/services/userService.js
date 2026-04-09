// src/services/userService.js
import apiClient from './apiClient';

export const getAllUsers = async () => {
  const response = await apiClient.get('/user/users');
  return response.data;
};