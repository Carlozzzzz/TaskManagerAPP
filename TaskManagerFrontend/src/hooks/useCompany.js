// MODIFIED: Injected ID into the update payload
import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService';
import { useToast } from './useToast';

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
				// FIXED: We spread the formData and explicitly add the ID 
				// so it matches the backend UpdateCompanyDto requirements.
				const updatePayload = { ...formData, id };
				await companyService.update(id, updatePayload);
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