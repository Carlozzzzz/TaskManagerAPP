// src/components/TaskFilter.jsx
const FILTERS = [
	{ label: 'All', value: 'all' },
	{ label: 'Todo', value: 'todo' },
	{ label: 'In Progress', value: 'inprogress' },
	{ label: 'Done', value: 'done' },
];

export default function TaskFilter({ onFilterChange, activeFilter, taskCounts }) {

	return (
		<div className="flex gap-2">
			{FILTERS.map(f => (
				<button
					key={f.value}
					onClick={() => onFilterChange(f.value)}
					className={`px-3 py-1 relative rounded-full text-xs font-medium border transition-colors
            ${activeFilter === f.value
							? 'bg-blue-500 text-white border-blue-500'
							: 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
						}`}
				>
					{taskCounts[f.value] > 0 && (
						<span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
							{taskCounts[f.value]}
						</span>
					)}
					{f.label}
				</button>
			))}
		</div>
	);
}