// src/components/TaskForm.jsx
import { useState } from 'react';

export default function TaskForm({ onSubmit, loading }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState('');

	// ADDED — inline field-level errors as one object
	const [fieldErrors, setFieldErrors] = useState({});

	// ADDED — validate before calling onSubmit
	const validate = () => {
		const errors = {};
		if (!title.trim())
			errors.title = 'Task title is required.';
		if (!dueDate)
			errors.dueDate = 'Due date is required.';
		
		const isPastDue = new Date(dueDate) < new Date();
		if(dueDate && isPastDue)
			errors.dueDate = 'Please select today or a future date.'
		return errors;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// ADDED — run validation, stop if errors exist
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}
		setFieldErrors({});

		onSubmit({ title, description, dueDate });
		setTitle('');
		setDescription('');
		setDueDate('');
	};

	// ADDED — clear field error as user types
	const clearFieldError = (field) =>
		setFieldErrors(prev => ({ ...prev, [field]: undefined }));

	return (
		<form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<h2 className="mb-3 font-medium text-gray-700">Add New Task</h2>

			<div className="flex flex-col gap-3">

				{/* ADDED — title field with inline error */}
				<div className="flex flex-col gap-1">
					<input
						type="text"
						placeholder="Task title"
						value={title}
						onChange={e => { setTitle(e.target.value); clearFieldError('title'); }}
						className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${fieldErrors.title ? 'border-red-400' : 'border-gray-200'}`}
					/>
					{/* ADDED */}
					{fieldErrors.title && (
						<p className="text-xs text-red-500">{fieldErrors.title}</p>
					)}
				</div>

				<input
					type="text"
					placeholder="Description (optional)"
					value={description}
					onChange={e => setDescription(e.target.value)}
					className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
				/>

				{/* ADDED — due date field with inline error */}
				<div className="flex flex-col gap-1">
					<input
						type="date"
						value={dueDate}
						onChange={e => { setDueDate(e.target.value); clearFieldError('dueDate'); }}
						className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${fieldErrors.dueDate ? 'border-red-400' : 'border-gray-200'}`}
					/>
					{/* ADDED */}
					{fieldErrors.dueDate && (
						<p className="text-xs text-red-500">{fieldErrors.dueDate}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={loading}
					className="rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
				>
					{loading ? 'Adding...' : 'Add Task'}
				</button>
			</div>
		</form>
	);
}