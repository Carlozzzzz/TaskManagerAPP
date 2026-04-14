// MODIFIED: Removed internal buttons to allow Modal Footer usage
import React, { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';

const initialFormState = { name: '' };

export default function UserAddEditForm({ initialData, onSubmit }) {
	const [form, setForm] = useState(initialFormState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (initialData) {
			setForm({ name: initialData.name });
		} else {
			setForm(initialFormState);
		}
	}, [initialData]);

	const validate = () => {
		const newErrors = {};
		if (!form.name.trim()) newErrors.name = 'Name is required';
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
		<form id="user-form" onSubmit={handleSubmit} className="space-y-4">
			<Input
				label="NAME"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				placeholder="e.g. Juan Carloz"
				error={errors.name}
				errorMessage={errors.name}
			/>
		</form>
	);
}