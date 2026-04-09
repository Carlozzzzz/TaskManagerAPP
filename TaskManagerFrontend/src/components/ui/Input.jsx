export const Input = ({
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
  ...props
}) => {
  return (
    <div className={`mb-1 ${parentClassName}`}>
      {/* Label */}
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-600">
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isEditMode || isDisabled || isViewOnly}
        className={`w-full box-border border border-solid border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />

      {/* Error message */}
      {error && <span className="mt-1 block text-sm text-red-500">{errorMessage}</span>}
    </div>
  );
};