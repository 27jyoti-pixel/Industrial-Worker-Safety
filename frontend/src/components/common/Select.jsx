import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-[#E63946]">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full text-sm rounded-xl border bg-white text-[#1E1E1E] px-3.5 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3E5C54]/25 disabled:bg-[#EEF2F0] disabled:text-[#6C757D] ${
          error
            ? 'border-[#E63946] focus:border-[#E63946] focus:ring-[#E63946]/20'
            : 'border-[#E0E0E0] focus:border-[#3E5C54]'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;

          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>

      {error && (
        <p className="mt-1 text-xs text-[#E63946] font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;