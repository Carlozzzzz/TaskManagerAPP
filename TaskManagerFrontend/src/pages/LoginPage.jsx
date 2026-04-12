// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login, register } from '../services/authService';
import { useToast } from '../hooks/useToast';

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
			navigate('/dashboard');
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
		<div className="flex min-h-screen items-center justify-center bg-gray-50">

			<div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

				<h1 className="mb-1 text-xl font-semibold text-gray-800">
					{isRegister ? 'Create account' : 'Welcome back'}
				</h1>
				<p className="mb-6 text-sm text-gray-400">
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
						className="mt-1 rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
					>
						{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
					</button>
				</form>

				<p className="mt-4 text-center text-xs text-gray-400">
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