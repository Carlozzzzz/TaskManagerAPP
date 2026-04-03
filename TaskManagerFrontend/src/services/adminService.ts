// src/services/adminService.ts
import apiClient from './apiClient';
import type { Task, User } from '../types/index';

export const getAllTasks = async (): Promise<Task[]> => {
	const response = await apiClient.get('/admin/tasks');
	return response.data;
};

export const getAllTasksAdmin = async (): Promise<Task[]> => {
	return getAllTasks();
};

export const getAllUsers = async (): Promise<User[]> => {
	const response = await apiClient.get('/admin/users');
	return response.data;
};