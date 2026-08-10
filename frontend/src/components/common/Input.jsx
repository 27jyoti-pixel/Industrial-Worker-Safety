import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>

      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && '*'}
        </label>
      )}

      {Icon && (
        <Icon className="absolute w-4 h-4 text-slate-400" />
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full text-sm rounded-lg border bg-white 
          text-slate-800 placeholder-slate-400 
          transition-colors 
          focus:outline-none 
          focus:ring-2 
          focus:ring-orange-500/20
          disabled:bg-slate-50 
          disabled:text-slate-500
          ${
            Icon 
            ? 'pl-9 pr-3 py-2' 
            : 'px-3.5 py-2'
          }
          ${
            error 
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-orange-600'
          }
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      )}

    </div>
  );
};

export default Input;