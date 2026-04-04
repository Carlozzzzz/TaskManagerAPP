// src/context/ConfirmProvider.tsx
import { useState, useRef, useCallback, ReactNode } from 'react';
import { ConfirmContext } from './ConfirmContext';
import { ConfirmModal } from '../components/shared/Confirm';

interface ConfirmProviderProps {
	children: ReactNode;
}

interface ConfirmConfig {
	title?: string;
	message?: string;
	type?: 'success' | 'delete' | 'error' | 'danger' | 'warning' | 'info' | 'save' | 'default';
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
	const [config, setConfig] = useState<ConfirmConfig | null>(null); // { title, message }
	const resolveRef = useRef<((value: boolean) => void) | null>(null); // This stores the "Promise Resolver"

	const askConfirm = useCallback((params: ConfirmConfig) => {
		setConfig(params);
		// ADDED - Create a promise and store the resolve function
		return new Promise<boolean>((resolve) => {
			resolveRef.current = resolve;
		})
	}, []);

	const handleClose = (result: boolean) => {
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