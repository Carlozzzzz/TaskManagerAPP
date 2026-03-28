// src/context/ConfirmProvider.jsx
import { useState, useRef, useCallback } from 'react';
import { ConfirmContext } from './ConfirmContext';
import ReactDOM from 'react-dom';

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
		<ConfirmContext.Provider value={askConfirm}>
			{children}
			{config && <ConfirmModal config={config} onResolve={handleClose} />}
		</ConfirmContext.Provider>
	);
}

// Internal Modal Component (Portaled to top level)
function ConfirmModal({ config, onResolve }) {
	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"> {/* FIXED: itesm-center & z-index */}
			{/* Backdrop - Now a SIBLING, not a parent of the card */}
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={() => onResolve(false)}
			/>

			{/* Modal Card */}
			<div className="animate-in fade-in zoom-in relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl duration-200">
				<h3 className="text-lg font-semibold text-gray-900">{config.title || 'Are you sure?'}</h3>
				<p className="mt-2 text-sm leading-relaxed text-gray-500">{config.message}</p> {/* FIXED: was confirm.message */}

				<div className="mt-6 flex gap-3">
					<button
						onClick={() => onResolve(false)}
						className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={() => onResolve(true)}
						className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-red-200 transition-colors hover:bg-red-600"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}