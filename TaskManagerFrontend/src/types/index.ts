// src/types/index.ts

// Permission/Auth types
export interface PermissionDto {
  moduleKey: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface AuthResponseDto {
  token: string;
  name: string;
  roles: string[];
  permissions: PermissionDto[];
}

// User type
export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: PermissionDto[];
}

// Task type
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
}

// API Response wrapper (for future use)
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}