// MODIFIED: Logic-heavy Hook
import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService';
import { useToast } from './useToast'; // ADDED: ERP Global Toast

export const useCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      showToast("Failed to load companies", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const saveCompany = async (formData, id = null) => {
    try {
      if (id) {
        await companyService.update(id, formData);
        showToast("Company updated successfully", "success");
      } else {
        await companyService.create(formData);
        showToast("Company created successfully", "success");
      }
      await fetchCompanies();
      return true;
    } catch (err) {
      showToast("Error saving company", "error");
      return false;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await companyService.delete(id);
      showToast("Company removed", "success");
      await fetchCompanies();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, saveCompany, deleteCompany, refresh: fetchCompanies };
};