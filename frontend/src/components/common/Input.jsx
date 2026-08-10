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
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-orange-600">*</span>}
        </label>
      )}


      <div className="relative">

        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 
            w-5 h-5 text-slate-400 pointer-events-none"
          />
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
          w-full
          text-sm
          rounded-lg
          border
          bg-white
          text-slate-800
          placeholder-slate-400
          transition-all

          focus:outline-none
          focus:ring-2
          focus:ring-orange-500/20

          disabled:bg-slate-50
          disabled:text-slate-500

          ${Icon ? 'pl-11 pr-3 py-3' : 'px-3.5 py-3'}

          ${
            error
            ? 'border-red-400 focus:border-red-500'
            : 'border-slate-300 focus:border-orange-500'
          }
          `}
          
          {...props}
        />

      </div>


      {error && (
        <p className="text-xs text-red-500 mt-1">
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