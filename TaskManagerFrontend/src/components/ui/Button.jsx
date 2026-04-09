// MODIFIED: Added Ghost variant and polished existing styles
import React from 'react';

export default function Button({
	name,
	icon: Icon,
	onClick,
	variant = 'primary',
	className = '',
	disabled = false,
	type = "button", // Added type for form handling
	...props
}) {
	const variants = {
		// REPLACED: Updated to match Compact Blue theme
		primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 uppercase tracking-widest text-[10px]",
		secondary: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm uppercase tracking-widest text-[10px]",
		danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 uppercase tracking-widest text-[10px]",
		// ADDED: Ghost variant for "Cancel" or "Text-only" actions
		ghost: "bg-transparent text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px] shadow-none"
	};

	return (
		<button
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${className}`}
			{...props}
		>
			{Icon && <span className="shrink-0 text-sm">{Icon}</span>}
			{name}
		</button>
	);
}