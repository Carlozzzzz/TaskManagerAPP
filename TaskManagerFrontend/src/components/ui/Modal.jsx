import { Close } from "@mui/icons-material";
import { createPortal } from "react-dom";

// MODIFIED: Visual polish
export default function Modal({ isOpen, onClose, title, children, footer }) {
	if (!isOpen) return null;
	return createPortal(
		<div className="fixed inset-0 z-modal flex items-center justify-center p-4">
			<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
			<div className="relative z-modal w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
				{/* HEADER */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<h3 className="text-lg font-bold text-slate-800">{title}</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Close /></button>
				</div>

				{/* BODY - Changed to white for seamless transition to footer */}
				<div className="bg-white p-6">
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