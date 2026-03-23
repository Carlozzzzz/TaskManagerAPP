// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login, register } from '../services/authService';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
	const { login: setAuth } = useAuth();
	const navigate = useNavigate();
	
	const { showToast } = useToast();

	const [isRegister, setIsRegister] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	// ADDED — inline field-level errors (one object, not three states)
	const [fieldErrors, setFieldErrors] = useState({});

	// ADDED — validate before hitting the API
	const validate = () => {
		const errors = {};
		if (isRegister && !name.trim())
			errors.name = 'Full name is required.';
		if (!email.trim())
			errors.email = 'Email is required.';
		if (!password)
			errors.password = 'Password is required.';
		else if (password.length < 6)
			errors.password = 'Password must be at least 6 characters.';
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// ADDED — run inline validation first, stop if errors exist
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}
		setFieldErrors({});
		setLoading(true);

		try {
			const data = isRegister
				? await register(name, email, password)
				: await login(email, password);

			setAuth(data);
			navigate('/tasks');
		} catch (err) {
			// MODIFIED — Improved error extraction from Axios
			const message = err.response?.data?.message || err.response?.data || 'Invalid credentials';
			showToast(message, 'error'); // This will now show because the page won't refresh!
		} finally {
			setLoading(false);
		}
	};

	// ADDED — clear field error as soon as user starts correcting it
	const clearFieldError = (field) =>
		setFieldErrors(prev => ({ ...prev, [field]: undefined }));

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">

			<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-sm">

				<h1 className="text-xl font-semibold text-gray-800 mb-1">
					{isRegister ? 'Create account' : 'Welcome back'}
				</h1>
				<p className="text-sm text-gray-400 mb-6">
					{isRegister ? 'Sign up to get started' : 'Sign in to your account'}
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					{isRegister && (
						<div className="flex flex-col gap-1">
							<input
								type="text"
								placeholder="Full name"
								value={name}
								onChange={e => { setName(e.target.value); clearFieldError('name'); }}
								className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                  ${fieldErrors.name ? 'border-red-400' : 'border-gray-200'}`}  // ADDED — red border on error
							/>
							{/* ADDED — inline error message */}
							{fieldErrors.name && (
								<p className="text-xs text-red-500">{fieldErrors.name}</p>
							)}
						</div>
					)}

					<div className="flex flex-col gap-1">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={e => { setEmail(e.target.value); clearFieldError('email'); }}
							className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'}`}  // ADDED
						/>
						{/* ADDED */}
						{fieldErrors.email && (
							<p className="text-xs text-red-500">{fieldErrors.email}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={e => { setPassword(e.target.value); clearFieldError('password'); }}
							className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                ${fieldErrors.password ? 'border-red-400' : 'border-gray-200'}`}  // ADDED
						/>
						{/* ADDED */}
						{fieldErrors.password && (
							<p className="text-xs text-red-500">{fieldErrors.password}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-md transition-colors mt-1"
					>
						{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
					</button>
				</form>

				<p className="text-xs text-center text-gray-400 mt-4">
					{isRegister ? 'Already have an account?' : "Don't have an account?"}
					{' '}
					<button
						onClick={() => { setIsRegister(!isRegister); setFieldErrors({}); }}
						className="text-blue-500 hover:underline"
					>
						{isRegister ? 'Sign in' : 'Sign up'}
					</button>
				</p>

			</div>
		</div>
	);
}