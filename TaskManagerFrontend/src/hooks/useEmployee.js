// MODIFIED: Injected ID into the update payload
import { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { useToast } from './useToast';
import { useConfirm } from './useConfirm';
import { useLoading } from './useLoading';

export const useEmployee = () => {
	const [employees, setEmployees] = useState([]);
	const [selectedEmployee, setSelectedEmployee] = useState(null);


	const { showToast } = useToast();
	const { loading, showLoading, hideLoading } = useLoading();

	const fetchEmployees = useCallback(async () => {
		showLoading();
		try {
			const data = await employeeService.getAll();
			setEmployees(data);
		} catch (err) {
			showToast("Failed to load Employees", "error");
		} finally {
			hideLoading();
		}
	}, [showToast]);


	const fetchEmployeeById = useCallback(async (id) => {
		showLoading();
		try {
			const data = await employeeService.getById(id);
			setSelectedEmployee(data);
			return data;
		} catch (err) {
			showToast("Failed to load employee", "error");
		} finally {
			hideLoading();
		}
	}, [showLoading, hideLoading, showToast]);

	const clearEmployeeSelection = useCallback(() => {
		setSelectedEmployee(null);
	}, []);

	const saveEmployee = async (formData, id = null) => {
		try {
			showLoading();

			if (id) {
				const updatePayload = { ...formData, id };
				await employeeService.update(id, updatePayload);
				showToast("Employee updated successfully", "success");
			} else {
				await employeeService.create(formData);
				showToast("Employee created successfully", "success");
			}

			await fetchEmployees();
			return true;
		} catch (err) {
			showToast("Error saving employee", "error");
			return false;
		} finally {
			hideLoading();
		}
	};

	const deleteEmployee = async (id) => {
		try {
			showLoading();

			await employeeService.delete(id);
			showToast("Employee removed", "success");
			await fetchEmployees();
		} catch (err) {
			showToast("Delete failed", "error");
		} finally {
			hideLoading();
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	return {
		employees,
		selectedEmployee,
		loading,
		setSelectedEmployee,
		saveEmployee,
		deleteEmployee,
		fetchEmployees,
		fetchEmployeeById,
		clearEmployeeSelection
	};
};