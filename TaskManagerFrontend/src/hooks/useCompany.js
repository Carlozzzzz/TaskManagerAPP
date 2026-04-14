// MODIFIED: Injected ID into the update payload
import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService';
import { useToast } from './useToast';
import { useConfirm } from './useConfirm';
import { useLoading } from './useLoading';

export const useCompany = () => {
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState(null);


	const { showToast } = useToast();
	const { loading, showLoading, hideLoading } = useLoading();


	const fetchCompanies = useCallback(async () => {
		showLoading();
		try {
			const data = await companyService.getAll();
			setCompanies(data);
		} catch (err) {
			showToast("Failed to load companies", "error");
		} finally {
			hideLoading();
		}
	}, [showToast]);

	const saveCompany = async (formData, id = null) => {
		try {
			showLoading();

			if (id) {
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
		} finally {
			hideLoading();
		}
	};

	const deleteCompany = async (id) => {
		try {
			showLoading();

			await companyService.delete(id);
			showToast("Company removed", "success");
			await fetchCompanies();
		} catch (err) {
			showToast("Delete failed", "error");
		} finally {
			hideLoading();
		}
	};

	useEffect(() => {
		fetchCompanies();
	}, [fetchCompanies]);

	return {
		companies,
		selectedCompany,
		loading,
		setSelectedCompany,
		saveCompany,
		deleteCompany,
		fetchCompanies
	};
};