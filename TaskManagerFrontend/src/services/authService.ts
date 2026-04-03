// src/services/authService.ts
import apiClient from './apiClient';
import type { AuthResponseDto } from '../types/index';

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponseDto> => {
  const response = await apiClient.post('/auth/register', {
    name,
    email,
    password
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponseDto> => {
  const response = await apiClient.post('/auth/login', {
    email,
    password
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};