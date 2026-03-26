// src/pages/TasksPage.jsx
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { createTask, deleteTask, updateTaskStatus } from '../services/taskService';
import TaskCard from '../components/modules/TaskCard';
import TaskForm from '../components/modules/TaskForm';
import TaskFilter from '../components/modules/TaskFilter';
import { useToast } from '../hooks/useToast';

export default function TasksPage() {
	const { tasks, loading, refetch } = useTasks();
	const [submitting, setSubmitting] = useState(false);
	const [activeFilter, setActiveFilter] = useState('all');

	const { showToast } = useToast();

	const filteredTasks = activeFilter === 'all'
		? tasks
		: tasks.filter(t => t.status === activeFilter);

	const taskCounts = {
		all: tasks.length,
		todo: tasks.filter(t => t.status === 'todo').length,
		inprogress: tasks.filter(t => t.status === 'inprogress').length,
		done: tasks.filter(t => t.status === 'done').length,
	};

	const STATUS_CYCLE = {
		todo: 'inprogress',
		inprogress: 'done',
		done: 'todo',
	};

	const handleCreate = async ({ title, description, dueDate }) => {
		try {
			setSubmitting(true);
			await createTask(title, description, dueDate);
			refetch();
			const message = 'Task created successfully.';
			showToast(message, 'success');
		} catch (error) {
			console.error(error);
			showToast('Failed to create task. Please try again.', 'error');
		} finally {
			setSubmitting(false);
		}
	};

	const handleUpdateStatus = async (id, currentStatus) => {
		try {
			const newStatus = STATUS_CYCLE[currentStatus];
			await updateTaskStatus(id, newStatus);
			refetch();
			const message = 'Task status updated.';
			showToast(message, 'success');
		} catch (error) {
			console.error(error);
			showToast('Failed to update task status. Please try again.', 'error');
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteTask(id);
			refetch();
		} catch (err) {
			// MODIFIED — was console.error, now shows toast
			showToast('Failed to delete task. Please try again.', 'error');
		}
	};

	const handleFilterChange = (status) => setActiveFilter(status);

	return (
		<div className="flex flex-col gap-4">
			<TaskFilter
				onFilterChange={handleFilterChange}
				activeFilter={activeFilter}
				taskCounts={taskCounts}
			/>
			<TaskForm onSubmit={handleCreate} loading={submitting} />

			{loading ? (
				<p className="text-center text-gray-400 text-sm">Loading tasks...</p>
			) : filteredTasks.length === 0 ? (
				<p className="text-center text-gray-400 text-sm">No tasks yet. Add one above.</p>
			) : (
				<div className="flex flex-col gap-3">
					{filteredTasks.map(task => (
						<TaskCard
							key={task.id}
							task={task}
							onDelete={handleDelete}
							onUpdateStatus={() => handleUpdateStatus(task.id, task.status)}
						/>
					))}
				</div>
			)}
		</div>
	);
}