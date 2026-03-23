// src/hooks/useToast.js

import { useCallback, useState } from "react";

export function useToast() {
	// ADDED - single object state: message + type together, null = hidden
	const [toast, setToast] = useState(null);

	// ADDED - show a toast: type is 'error' | 'success' | 'info'
	const showToast = useCallback((message, type = 'error') => {
		setToast({ message, type });

		// ADDED - auto-dismiss after 4 seconds
		setTimeout(() => setToast(null), 4000);
	}, []);

	// ADDED - manual dismiss (e.g. clicking the X button)
	const hideToast = useCallback(() => setToast(null), []);

	return { toast, showToast, hideToast };
}