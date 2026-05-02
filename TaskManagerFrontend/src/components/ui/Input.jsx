// MODIFIED: Added hooks for accessibility and refs
import React, { useId, forwardRef } from 'react';

export const Input = forwardRef(({
	label,
	isRequired = false,
	isDisabled = false,
	isEditMode = false,
	isViewOnly = false,
	type = "text",
	value,
	onChange,
	placeholder = "",
	className = "", parentClassName ="",
	error = false,
	errorMessage = "",
	startIcon: StartIcon, // ADDED: Support for Lucide icons
	...props
}, ref) => {
	// ADDED: Generate a unique ID for accessibility
	const generatedId = useId();
	const inputId = props.id || generatedId;

	// MODIFIED: Consolidate disabled state
	const isInputDisabled = isEditMode || isDisabled || isViewOnly;

	return (
		<div className={`mb-1 ${parentClassName}`}>
			{/* Label */}
			{label && (
				<label
					htmlFor={inputId} // MODIFIED: Properly linked to input
					className="mb-1.5 block text-sm font-medium text-gray-600"
				>
					{label}
					{isRequired && <span className="ml-1 text-red-500">*</span>}
				</label>
			)}

			{/* Input Wrapper */}
			{/* ADDED: Relative container to anchor the icon */}
			<div className="relative flex items-center">

				{/* Icon Slot */}
				{StartIcon && (
					<div className="pointer-events-none absolute left-3 flex items-center text-gray-400">
						{/* // ADDED: Icon sized and colored consistently */}
						<StartIcon size={18} strokeWidth={2} />
					</div>
				)}

				<input
					ref={ref} // ADDED: Forwarded ref
					id={inputId} // ADDED: Accessibility ID
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={isInputDisabled}
					// MODIFIED: Added conditional padding-left (pl-10) if icon exists
					className={`
            w-full box-border border border-solid border-gray-300 rounded-md py-2 px-3 
            text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            ${StartIcon ? "pl-10" : ""} 
            ${error ? "border-red-500" : ""} 
            ${isInputDisabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
            ${className}
          `}
					{...props}
				/>
			</div>

			{/* Error message */}
			{error && (
				<span className="mt-1 block text-sm text-red-500">
					{errorMessage}
				</span>
			)}
		</div>
	);
});

// ADDED: Explicitly set display name for debugging
Input.displayName = 'Input';