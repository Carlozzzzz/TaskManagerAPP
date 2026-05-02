// MODIFIED: Removed internal buttons to allow Modal Footer usage
import React, { useState, useEffect } from 'react';
import { Input } from '../../../ui/Input';

const initialFormState = {
	firstName: '',
	lastName: '',
	middleName: '',
	suffix: '',
};

export default function EmployeeForm({ initialData, onSubmit }) {
	const [form, setForm] = useState(initialFormState);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (initialData) {
			setForm({ 
				firstName: initialData.firstName || '',
				lastName: initialData.lastName || '',
				middleName: initialData.middleName || '',
				suffix: initialData.suffix || ''
			});
		} else {
			setForm(initialFormState);
		}
	}, [initialData]);

	const validate = () => {
		const newErrors = {};
		if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
		if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Inside EmployeeAddEditForm.jsx
	const handleSubmit = (e) => {
		e.preventDefault();

		if (validate()) {
			onSubmit(form);
		}
	};

	return (
		// ADDED: An ID so the footer button can find this form
		<form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
			<Input
				label="FIRST NAME"
				value={form.firstName}
				onChange={(e) => setForm({ ...form, firstName: e.target.value })}
				placeholder="e.g. John"
				error={errors.firstName}
				errorMessage={errors.firstName}
			/>
			<Input
				label="LAST NAME"
				value={form.lastName}
				onChange={(e) => setForm({ ...form, lastName: e.target.value })}
				placeholder="e.g. Doe"
				error={errors.lastName}
				errorMessage={errors.lastName}
			/>
			<Input
				label="MIDDLE NAME"
				value={form.middleName}
				onChange={(e) => setForm({ ...form, middleName: e.target.value })}
				placeholder="e.g. Smith"
			/>
			<Input
				label="SUFFIX"
				value={form.suffix}
				onChange={(e) => setForm({ ...form, suffix: e.target.value })}
				placeholder="e.g. Jr."
			/>
		</form>
	);
}