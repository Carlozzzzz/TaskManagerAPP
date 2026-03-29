// src/components/TaskCard.jsx

const STATUS_STYLES = {
	todo: 'bg-gray-100 text-gray-600',
	inprogress: 'bg-blue-100 text-blue-600',
	done: 'bg-green-100 text-green-600',
};

export default function TaskCard({ task, onDelete, onUpdateStatus }) {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm" onClick={onUpdateStatus}>

			<div className="flex items-start justify-between gap-2">
				<h3 className="font-medium text-gray-800">{task.title}</h3>
				<span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[task.status] ?? STATUS_STYLES.todo}`}>
					{task.status}
				</span>
			</div>

			{task.description && (
				<p className="mt-1 text-sm text-gray-500">{task.description}</p>
			)}

			<div className="mt-3 flex items-center justify-between">
				<span className="text-xs text-gray-400">
					Due: {new Date(task.dueDate).toLocaleDateString()}
				</span>
				<button
					onClick={(e) => { e.stopPropagation(); onDelete(task.id);}}
					className="text-xs text-red-400 transition-colors hover:text-red-600"
				>
					Delete
				</button>
			</div>

		</div >
	);
}