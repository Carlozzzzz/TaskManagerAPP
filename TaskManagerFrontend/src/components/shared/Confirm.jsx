// src/components/shared/Confirm.jsx
import ReactDOM from 'react-dom';

export function ConfirmModal({ config, onResolve }) {
	const colorFinder = () => {
		switch (config.type) {
			case 'success':
				return 'bg-green-500 hover:bg-green-600';
			case 'delete':
			case 'error':
			case 'danger':
				return 'bg-red-500 hover:bg-red-600';
			case 'warning':
				return 'bg-yellow-500 hover:bg-yellow-600';
			case 'info':
			case 'save':
			case 'default':
			case undefined:
			case '':
			default:
				return 'bg-blue-500 hover:bg-blue-600';
		}
		
	}
	
	const colorClasses = colorFinder();
	
	return ReactDOM.createPortal(
		<div className="z-confirm fixed inset-0 flex items-center justify-center p-4"> {/* FIXED: itesm-center & z-index */}
			{/* Backdrop - Now a SIBLING, not a parent of the card */}
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={() => onResolve(false)}
			/>

			{/* Modal Card */}
			<div className="animate-in fade-in zoom-in relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl duration-200">
				<h3 className="text-lg font-semibold text-gray-900">{config.title || 'Are you sure?'}</h3>
				<p className="my-10 text-sm leading-relaxed text-gray-500">{config.message}</p> {/* FIXED: was confirm.message */}

				<div className="mt-6 flex gap-3">
					<button
						onClick={() => onResolve(false)}
						className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={() => onResolve(true)}
						className={`flex-1 rounded-lg ${colorClasses} px-4 py-2 text-sm font-medium text-white shadow-sm shadow-red-200 transition-colors hover:bg-red-600`}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}