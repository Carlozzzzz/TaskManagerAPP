// src/pages/AdminPage.jsx
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';

export default function AdminPage() {

	const [activeTab, setActiveTab] = useState('tasks');

	const { allTasks, loading } = useTasks();
	const { allUsers } = useUsers();

	const STATUS_STYLES = {
		todo: 'bg-gray-100 text-gray-600',
		inprogress: 'bg-blue-100 text-blue-600',
		done: 'bg-green-100 text-green-600',
	};

	return (
		<>
			{/* Tabs */}
			<div className="mb-6 flex gap-2">
				<button
					onClick={() => setActiveTab('tasks')}
					className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors
              ${activeTab === 'tasks'
							? 'bg-blue-500 text-white border-blue-500'
							: 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
						}`}
				>
					All Tasks ({allTasks.length})
				</button>
				<button
					onClick={() => setActiveTab('users')}
					className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors
              ${activeTab === 'users'
							? 'bg-blue-500 text-white border-blue-500'
							: 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
						}`}
				>
					All Users ({allUsers.length})
				</button>
			</div>

			{loading ? (
				<p className="text-center text-sm text-gray-400">Loading...</p>
			) : activeTab === 'tasks' ? (

				<div className="flex flex-col gap-3">
					{allTasks.length === 0 ? (
						<p className="text-center text-sm text-gray-400">No tasks found.</p>
					) : allTasks.map(task => (
						<div key={task.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div className="flex items-start justify-between gap-2">
								<h3 className="font-medium text-gray-800">{task.title}</h3>
								<span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[task.status] ?? STATUS_STYLES.todo}`}>
									{task.status}
								</span>
							</div>
							{task.description && (
								<p className="mt-1 text-sm text-gray-500">{task.description}</p>
							)}
							<span className="mt-2 block text-xs text-gray-400">
								Due: {new Date(task.dueDate).toLocaleDateString()}
							</span>
						</div>
					))}
				</div>

			) : (

				<div className="flex flex-col gap-3">
					{allUsers.length === 0 ? (
						<p className="text-center text-sm text-gray-400">No users found.</p>
					) : allUsers.map(u => (
						<div key={u.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div>
								<p className="font-medium text-gray-800">{u.name}</p>
								<p className="text-sm text-gray-500">{u.email}</p>
							</div>
							<span className={`text-xs px-2 py-1 rounded-full font-medium border
                  ${u.role === 'admin'
									? 'bg-purple-100 text-purple-600 border-purple-200'
									: 'bg-gray-100 text-gray-600 border-gray-200'
								}`}>
								{u.role}
							</span>
						</div>
					))}
				</div>

			)}
		</>
	);
}