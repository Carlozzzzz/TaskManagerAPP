// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { getAllUsers } from '../services/userService';
import { useLoading } from './useLoading';

export function useUsers() {
	const [allUsers, setAllUsers] = useState([]);
	const [error, setError] = useState(null);
	
	const { loading, showLoading, hideLoading } = useLoading();

	const fetchAllUsers = useCallback(async () => {
		try {
			showLoading();
			const data = await getAllUsers();
			setAllUsers(data);
		} catch (err) {
			setError(err.message);
		} finally {
			hideLoading();
		}
	}, []);

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	return { allUsers, loading, error, fetchAllUsers };
}