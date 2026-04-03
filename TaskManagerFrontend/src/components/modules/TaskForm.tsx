// src/components/modules/TaskForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskInput } from '../../schemas/taskSchemas';

interface TaskFormProps {
	onSubmit: (data: CreateTaskInput) => void;
	loading: boolean;
}

export default function TaskForm({ onSubmit, loading }: TaskFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateTaskInput>({
		resolver: zodResolver(createTaskSchema),
		mode: 'onBlur',
	});

	const onValid = (data: CreateTaskInput) => {
		onSubmit(data);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onValid)} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<h2 className="mb-3 font-medium text-gray-700">Add New Task</h2>

			<div className="flex flex-col gap-3">

				{/* Title field */}
				<div className="flex flex-col gap-1">
					<input
						type="text"
						placeholder="Task title"
						{...register('title')}
						className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
					/>
					{errors.title && (
						<p className="text-xs text-red-500">{errors.title.message}</p>
					)}
				</div>

				{/* Description field */}
				<input
					type="text"
					placeholder="Description (optional)"
					{...register('description')}
					className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
				/>

				{/* Due date field */}
				<div className="flex flex-col gap-1">
					<input
						type="date"
						{...register('dueDate')}
						className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${errors.dueDate ? 'border-red-400' : 'border-gray-200'}`}
					/>
					{errors.dueDate && (
						<p className="text-xs text-red-500">{errors.dueDate.message}</p>
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