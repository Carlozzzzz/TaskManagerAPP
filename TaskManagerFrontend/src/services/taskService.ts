// src/services/taskService.ts
import apiClient from './apiClient';
import type { Task } from '../types/index';

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await apiClient.post('/tasks', task);
  return response.data;
};

export const updateTaskStatus = async (
  id: number,
  status: Task['status']
): Promise<Task> => {
  const response = await apiClient.put(`/tasks/update-status/${id}`, { status });
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};