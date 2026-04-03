// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { login, register } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../schemas/authSchemas';

export default function LoginPage() {
	const { login: setAuth } = useAuth();
	const navigate = useNavigate();
	const { showToast } = useToast();

	const [isRegister, setIsRegister] = useState(false);
	const [loading, setLoading] = useState(false);

	// Login form
	const loginForm = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		mode: 'onBlur',
	});

	// Register form
	const registerForm = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		mode: 'onBlur',
	});

	const currentForm = isRegister ? registerForm : loginForm;
	const { register: registerField, handleSubmit, formState: { errors }, reset } = currentForm;

	const onSubmit = async (data: LoginInput | RegisterInput) => {
		setLoading(true);

		try {
			if (isRegister && 'name' in data) {
				const response = await register(data.name, data.email, data.password);
				setAuth(response);
			} else if (!isRegister && !('name' in data)) {
				const response = await login(data.email, data.password);
				setAuth(response);
			}
			navigate('/tasks');
		} catch (err: any) {
			const message = err.response?.data?.message || err.response?.data || 'Authentication failed';
			showToast(message, 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleToggleMode = () => {
		setIsRegister(!isRegister);
		reset();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

				<h1 className="mb-1 text-xl font-semibold text-gray-800">
					{isRegister ? 'Create account' : 'Welcome back'}
				</h1>
				<p className="mb-6 text-sm text-gray-400">
					{isRegister ? 'Sign up to get started' : 'Sign in to your account'}
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
					{isRegister && (
						<div className="flex flex-col gap-1">
							<input
								type="text"
								placeholder="Full name"
								{...registerField('name')}
								className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                  ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
							/>
							{errors.name && (
								<p className="text-xs text-red-500">{errors.name.message}</p>
							)}
						</div>
					)}

					<div className="flex flex-col gap-1">
						<input
							type="email"
							placeholder="Email"
							{...registerField('email')}
							className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
						/>
						{errors.email && (
							<p className="text-xs text-red-500">{errors.email.message}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<input
							type="password"
							placeholder="Password"
							{...registerField('password')}
							className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
						/>
						{errors.password && (
							<p className="text-xs text-red-500">{errors.password.message}</p>
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
						onClick={handleToggleMode}
						className="text-blue-500 hover:underline"
					>
						{isRegister ? 'Sign in' : 'Sign up'}
					</button>
				</p>

			</div>
		</div>
	);
}