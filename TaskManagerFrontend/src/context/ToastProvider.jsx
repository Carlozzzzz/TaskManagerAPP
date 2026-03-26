// src/context/ToastProvider.jsx

import { useCallback, useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "../components/shared/Toast";

export function ToastProvider({ children }) {
	const [toast, setToast] = useState(null);

	// Function to trigger the toast from anywhere
	const showToast = useCallback((message, type = 'error') => {
		setToast({ message, type });
		// Auto-hide logic stays here in the center
		setTimeout(() => setToast(null), 3000);
	}, []);

	const hideToast = useCallback(() => setToast(null), []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			
			{/* ADDED - This is the "ONE PLACE".
			It sits above all routes and pages.
		*/}
			<Toast toast={toast} onHide={hideToast} />
		</ToastContext.Provider>
	);
}