// src/hooks/useRoles.js
import { useState, useCallback, useEffect } from 'react';
import { roleService } from '../services/roleService';
import { moduleService } from '../services/moduleService';
import { useLoading } from './useLoading';
import { useToast } from './useToast';

export function useRoles() {
	const [roles, setRoles] = useState([]);
	const [rolePermissions, setRolePermissions] = useState([]);

	const [selectedRole, setSelectedRole] = useState(null);

	const { loading, showLoading, hideLoading } = useLoading();
	const { showToast } = useToast();

	const fetchRoles = useCallback(async () => {
		showLoading();
		try {
			const rolesData = await roleService.getAll();
			setRoles(rolesData);
		} catch (err) {
			showToast("Failed to load role data", "error");
			console.error("Error: ", err)
		} finally {
			hideLoading();
		}
	}, [showLoading, hideLoading, showToast]);

	const fetchRolePermission = useCallback(async (id) => {
		if (!id) {
			setRolePermissions(null); // Clear for "New Role" mode
			return;
		}

		showLoading();
		try {
			const rolePermissionsData = await roleService.getByIdWithPermissions(id);
			setRolePermissions(rolePermissionsData);
			return rolePermissionsData; // ADDED: Return data for immediate use if needed
		} catch (err) {
			showToast("Failed to load role permissions", "error");
			console.error("Error: ", err);
		} finally {
			hideLoading();
		}
	}, [showLoading, hideLoading, showToast]);

	const saveRole = async (id, payload) => {
		showLoading();
		try {
			if (id) await roleService.update(id, payload);
			else await roleService.create(payload);
			showToast("Role saved successfully", "success");
			await fetchRoles();
			return true;
		} catch (err) {
			showToast("Error saving role", "error");
			return false;
		} finally {
			hideLoading();
		}
	};

	return {
		roles,
		rolePermissions,
		selectedRole, setSelectedRole,
		loading,
		fetchRoles,
		fetchRolePermission,
		saveRole
	};
}