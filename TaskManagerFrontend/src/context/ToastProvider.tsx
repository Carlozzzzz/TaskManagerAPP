// src/context/ToastProvider.tsx
import { useCallback, useState, ReactNode } from 'react';
import { ToastContext, type ToastContextType } from './ToastContext';
import Toast from '../components/shared/Toast';

interface ToastProviderProps {
	children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

	// Function to trigger the toast from anywhere
	const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'error') => {
		setToast({ message, type });
		// Auto-hide logic stays here in the center
		setTimeout(() => setToast(null), 3000);
	}, []);

	const hideToast = useCallback(() => setToast(null), []);

	const value: ToastContextType = {
		showToast,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}

			{/* ADDED - This is the "ONE PLACE".
			It sits above all routes and pages.
		*/}
			<Toast toast={toast} onHide={hideToast} />
		</ToastContext.Provider>
	);
}