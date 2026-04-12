// MODIFIED: Removed internal buttons to allow Modal Footer usage
import React, { useState, useEffect } from 'react';
import { Input } from '../../../ui/Input';

const initialFormState = { description: '', isActive: true };

export default function CompanyForm({ initialData, onSubmit }) {
	const [form, setForm] = useState(initialFormState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (initialData) {
			setForm({ description: initialData.description || '', isActive: initialData.isActive ?? true });
		} else {
			setForm(initialFormState);
		}
	}, [initialData]);

	const validate = () => {
		const newErrors = {};
		if (!form.description.trim()) newErrors.description = 'Company name is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Inside CompanyAddEditForm.jsx
	const handleSubmit = (e) => {
		e.preventDefault();

		if (validate()) {
			onSubmit(form);
		}
	};

	return (
		// ADDED: An ID so the footer button can find this form
		<form id="company-form" onSubmit={handleSubmit} className="space-y-4">
			<Input
				label="COMPANY NAME"
				value={form.description}
				onChange={(e) => setForm({ ...form, description: e.target.value })}
				placeholder="e.g. Acme Corp"
				error={errors.description}
				errorMessage={errors.description}
			/>
			<div className="flex items-center gap-3 py-2">
				<input
					type="checkbox"
					id="activeStatus"
					checked={form.isActive}
					onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
					className="h-5 w-5 cursor-pointer rounded border-slate-300 accent-blue-600"
				/>
				<label htmlFor="activeStatus" className="cursor-pointer text-sm font-bold text-slate-600">
					Set as Active Status
				</label>
			</div>
		</form>
	);
}