// MODIFIED: Standardized ERP Service
import apiClient from "./apiClient";

export const companyService = {
  getAll: async () => {
    const response = await apiClient.get('/Company');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/Company', data);
    return response.data;
  },
  // ADDED: Update method for Edit functionality
  update: async (id, data) => {
    const response = await apiClient.put(`/Company/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    // ERP Rule: Backend should handle "Soft Delete" via this endpoint
    const response = await apiClient.delete(`/Company/${id}`);
    return response.data;
  }
};