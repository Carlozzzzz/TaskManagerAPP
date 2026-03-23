// src/services/authService.js
import api from './api';

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data; // returns { token, name, role }
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // returns { token, name, role }
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};