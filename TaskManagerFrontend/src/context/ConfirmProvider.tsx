// src/context/ConfirmProvider.jsx
import { useState, useRef, useCallback } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmModal } from '../components/shared/Confirm';

export function ConfirmProvider({ children }) {
	const [config, setConfig] = useState(null); // { title, message }
	const resolveRef = useRef(null); // This stores the "Promise Resolver"

	const askConfirm = useCallback((params) => {
		setConfig(params);
		// ADDED - Create a promise and store the resolve function
		return new Promise((resolve) => {
			resolveRef.current = resolve;
		})
	}, []);

	const handleClose = (result) => {
		setConfig(null);
		if (resolveRef.current) {
			resolveRef.current(result); // Sends 'true' or 'false' back to the caller
			resolveRef.current = null;
		}
	}

	return (
		<ConfirmContext.Provider value={{ askConfirm }}>
			{children}
			{config && <ConfirmModal config={config} onResolve={handleClose} />}
		</ConfirmContext.Provider>
	);
}