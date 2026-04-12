// src/pages/TasksPage.jsx
import { useMemo, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/modules/Task/TaskCard';
import TaskForm from '../components/modules/Task/TaskForm';
import TaskFilter from '../components/modules/Task/TaskFilter';
import { useConfirm } from '../hooks/useConfirm';

export default function TasksPage() {
	const { tasks, loading, saveTask, updateStatus, deleteTask } = useTasks();
	const [activeFilter, setActiveFilter] = useState('all');

	const { askConfirm } = useConfirm();

	const filteredTasks = useMemo(() =>
		activeFilter === 'all'
			? tasks
			: tasks.filter(t => t.status === activeFilter),
		[tasks, activeFilter]);

	const taskCounts = useMemo(() => ({
		all: tasks.length,
		todo: tasks.filter(t => t.status === 'todo').length,
		inprogress: tasks.filter(t => t.status === 'inprogress').length,
		done: tasks.filter(t => t.status === 'done').length,
	}), [tasks]);

	const handleCreate = async ({ title, description, dueDate }) => {
		const isOk = await askConfirm({
			title: 'Create Task?',
			message: 'Are you sure you want to proceed?'
		});

		if (!isOk) await saveTask(title, description, dueDate);
	};

	const handleUpdateStatus = async (id, currentStatus) => {
		const isOk = await askConfirm({
			title: 'Update Task Status?',
			message: 'Are you sure you want to proceed?'
		});

		if (isOk) await updateStatus(id, currentStatus);
	}

	const handleDelete = async (id) => {
		const isOk = await askConfirm({
			title: 'Delete Task?',
			type: 'delete',
			message: 'Are you sure you want to delete this? This action cannot be undone.'
		});

		if (isOk) await deleteTask(id);
	};

	const handleFilterChange = (status) => setActiveFilter(status);

	return (
		<div className="flex flex-col gap-4">
			<TaskFilter
				onFilterChange={handleFilterChange}
				activeFilter={activeFilter}
				taskCounts={taskCounts}
			/>
			<TaskForm onSubmit={handleCreate} loading={loading} />

			{loading ? (
				<p className="text-center text-sm text-gray-400">Loading tasks...</p>
			) : filteredTasks.length === 0 ? (
				<p className="text-center text-sm text-gray-400">No tasks yet. Add one above.</p>
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