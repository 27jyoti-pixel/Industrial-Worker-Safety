import React from 'react';

const Input = ({ label, type='text', name, value, onChange, placeholder, error, required=false, disabled=false, helperText, icon: Icon, className='', ...props }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-sm font-semibold text-sand-700 mb-2">{label} {required && <span className="text-accent-600">*</span>}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sand-400 pointer-events-none" />}
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        disabled={disabled} required={required}
        className={`w-full text-sm rounded-xl border bg-white text-sand-900 placeholder-sand-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/15 disabled:bg-sand-50 disabled:text-sand-500 ${Icon ? 'pl-10 pr-3 py-3' : 'px-3.5 py-3'} ${error ? 'border-red-400 focus:border-red-500' : 'border-sand-300 focus:border-brand-500'}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    {helperText && !error && <p className="text-xs text-sand-500 mt-1.5">{helperText}</p>}
  </div>
);

export default Input;
