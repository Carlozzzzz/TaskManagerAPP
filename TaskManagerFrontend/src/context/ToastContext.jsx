// src/context/ToastContext.jsx

import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function ToastProivider({ children }) {
	const [toast, setToast] = useState(null);

	// Function to trigger the toast from anywhere
	const showToast = useCallback((message, type = 'error') => {
		setToast({ message, type });
		// Auto-hide logic stays here in the center
		setTimeout(() => setToast(null), 4000);
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

export const useToast = () => {
	const context = useContext(ToastContext);
	if(!context) throw new Error("useToast must be used within ToastProvider");
	return context;
}