// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useLoading } from './useLoading';
import { useToast } from './useToast';
import { TASK_STATUS_CYCLE } from '../constants/taskStatusCycle';

export function useTasks() {
	const [allTasks, setAllTasks] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState(null);

	const { showToast } = useToast();
	const { loading, showLoading, hideLoading } = useLoading();

	const fetchAllTasks = useCallback(async () => {
		try {
			showLoading();
			const data = await taskService.getAllTasks();
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
			const data = await taskService.getCurrentUserTasks();
			setTasks(data);
		} catch (err) {
			setError(err.message);
		} finally {
			hideLoading();
		}
	}, []);

	const saveTask = async (title, description, dueDate) => {
		try {
			showLoading();

			await taskService.create(title, description, dueDate);
			await fetchCurrentUserTasks();
			const message = 'Task created successfully.'
			showToast(message, 'success');
		} catch (err) {
			console.error(err);
			setError(err.message);
			showToast('Failed to create task. Please try again.', 'error')
		} finally {
			hideLoading();
		}
	}

	const updateStatus = async (id, currentStatus) => {
		try {
			showLoading();

			const newStatus = TASK_STATUS_CYCLE[currentStatus];
			await taskService.updateStatus(id, newStatus);
			fetchCurrentUserTasks();
			const message = 'Successfully updated.';
			showToast(message, 'success');
		} catch (err) {
			console.error(err);
			setError(err.message);
			showToast('Failed to update task status. Please try again.', 'error');
		} finally {
			hideLoading();
		}
	}
	
	const deleteTask = async (id) => {
		try {
			showLoading();

			await taskService.delete(id);
			fetchCurrentUserTasks();
			const message = 'Successfully deleted!';
			showToast(message, 'success');
		} catch (error) {
			console.error(error);
			setError(err.message);
			showToast('Failed to update task status. Please try again.', 'error');
		} finally {
			hideLoading();
		}
	}

	useEffect(() => {
		fetchAllTasks();
	}, [fetchAllTasks]);

	useEffect(() => {
		fetchCurrentUserTasks();
	}, [fetchCurrentUserTasks]);

	return { tasks, allTasks, loading, error, saveTask, updateStatus, deleteTask };
}