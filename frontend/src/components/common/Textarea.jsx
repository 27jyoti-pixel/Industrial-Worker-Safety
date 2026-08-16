import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-sand-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full text-sm rounded-xl border bg-white text-sand-800 px-3.5 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-sand-50 disabled:text-sand-500 ${
          error ? 'border-red-400 focus:border-red-500' : 'border-sand-300 focus:border-brand-600'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};

export default Textarea;
