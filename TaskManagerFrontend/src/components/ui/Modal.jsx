// src/components/ui/Modal.jsx
import { Close } from "@mui/icons-material";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children, footer, size = "lg" }) {
	if (!isOpen) return null;

	// MODIFIED: Added size mapping
	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"4xl": "max-w-4xl",
		"6xl": "max-w-6xl",
	};

	return createPortal(
		<div className="fixed inset-0 z-modal flex items-center justify-center p-4">
			<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

			{/* MODIFIED: Width controlled by size prop */}
			<div className={`relative z-modal w-full ${sizeClasses[size] || sizeClasses.lg} overflow-hidden rounded-2xl bg-white shadow-2xl transition-all`}>

				{/* HEADER */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h3 className="text-xl font-bold text-blue-600">{title}</h3>
					<button onClick={onClose} className="text-slate-400 transition-colors hover:text-slate-600">
						<Close />
					</button>
				</div>

				{/* BODY */}
				<div className="max-h-[75vh] overflow-y-auto bg-white p-6">
					{children}
				</div>

				{/* FOOTER */}
				{footer && (
					<div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
}