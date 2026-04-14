// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { useLoading } from './useLoading';
import { useToast } from './useToast';
import { resetUserPass } from '../services/authService';

export function useUsers() {
	const [allUsers, setAllUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [error, setError] = useState(null);

	const { showToast } = useToast();
	const { loading, showLoading, hideLoading } = useLoading();

	const fetchAllUsers = useCallback(async () => {
		try {
			showLoading();
			const data = await userService.getAllUsers();
			setAllUsers(data);
		} catch (err) {
			setError(err.message);
		} finally {
			hideLoading();
		}
	}, []);

	const resetUserPassword = async (userId) => {
		try {
			showLoading();

			if (userId) {
				await resetUserPass(userId);
				showToast("Password reset successfully", "success");
			}

			await fetchAllUsers();
			return true;
		} catch (err) {
			console.error("Error", err)
			showToast("Error resetting password", "error");
			return false;
		} finally {
			hideLoading();
		}
	}

	const updateUser = async (id = null, data) => {
		try {
			if (id) {
				const updatePayload = { id, ...data };
				
				await userService.update(id, updatePayload);
				fetchAllUsers();
				showToast("User updated successfully", "success");
			}

		} catch (err) {
			console.error("Error: ", err)
			showToast("Error saving user", "error");
		} finally {
			hideLoading();
		}
	}

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	return {
		allUsers,
		selectedUser,
		loading,
		error,
		setSelectedUser,
		fetchAllUsers,
		resetUserPassword,
		updateUser,
	};
}