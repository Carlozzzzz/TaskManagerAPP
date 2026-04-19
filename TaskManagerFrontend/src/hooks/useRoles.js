// src/hooks/useRoles.js
import { useState, useCallback } from 'react';
import { roleService } from '../services/roleService';
import { moduleService } from '../services/moduleService';
import { useLoading } from './useLoading';
import { useToast } from './useToast';

export function useRoles() {
	const [roles, setRoles] = useState([]);
	const [dbModules, setDbModules] = useState([]); // Needed for ID mapping
	const { loading, showLoading, hideLoading } = useLoading();
	const { showToast } = useToast();

	const fetchRolesAndModules = useCallback(async () => {
		showLoading();
		try {
			const [rolesData, modulesData] = await Promise.all([
				roleService.getAll(),
				moduleService.getAllModules()
			]);
			setRoles(rolesData);
			setDbModules(modulesData);

			console.log({ rolesData, modulesData });

		} catch (err) {
			showToast("Failed to load role data", "error");
		} finally {
			hideLoading();
		}
	}, []);

	const saveRole = async (id, payload) => {
		showLoading();
		try {
			if (id) await roleService.update(id, payload);
			else await roleService.create(payload);
			showToast("Role saved successfully", "success");
			await fetchRolesAndModules();
			return true;
		} catch (err) {
			showToast("Error saving role", "error");
			return false;
		} finally {
			hideLoading();
		}
	};

	return { roles, dbModules, loading, fetchRolesAndModules, saveRole };
}