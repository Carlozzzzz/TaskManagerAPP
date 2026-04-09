// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserTasks, getAllTasks } from '../services/taskService';
import { useLoading } from './useLoading';

export function useTasks() {
	const [allTasks, setAllTasks] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState(null);
	
	const { loading, showLoading, hideLoading } = useLoading();

	const fetchAllTasks = useCallback(async () => {
		try {
			showLoading();
			const data = await getAllTasks();
			setAllTasks(data);
		} catch (err) {
			setError(err.message);
		} finally {
			hideLoading();
		}
	}, []);

	const fetchCurrentUserTasks = useCallback(async () => {
		try {
			showLoading();
			const data = await getCurrentUserTasks();
			setTasks(data);
		} catch (err) {
			setError(err.message);
		} finally {
			hideLoading();
		}
	}, []);


	useEffect(() => {
		fetchAllTasks();
	}, [fetchAllTasks]);

	useEffect(() => {
		fetchCurrentUserTasks();
	}, [fetchCurrentUserTasks]);

	return { tasks, allTasks, loading, error, refetch: fetchCurrentUserTasks, fetchAllTasks };
}