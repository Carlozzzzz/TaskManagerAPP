// src/pages/TasksPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { createTask, deleteTask, updateTaskStatus } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import { useToast } from '../context/ToastContext';

export default function TasksPage() {
	const { user, logout } = useAuth();
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

	const navigate = useNavigate();

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
		<div className="min-h-screen bg-gray-50">

			{/* Navbar */}
			<nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
				<h1 className="font-semibold text-gray-800">Task Manager</h1>
				<div className="flex items-center gap-4">
					{user?.role === 'admin' && (
						<button
							onClick={() => navigate('/admin')}
							className="text-sm text-purple-500 hover:text-purple-700 transition-colors font-medium"
						>
							Admin Panel
						</button>
					)}
					<span className="text-sm text-gray-500">
						Hi, <span className="font-medium text-gray-700">{user?.name}</span>
					</span>
					<button
						onClick={logout}
						className="text-sm text-red-400 hover:text-red-600 transition-colors"
					>
						Logout
					</button>
				</div>
			</nav>

			{/* Main content */}
			<div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
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
		</div>
	);
}