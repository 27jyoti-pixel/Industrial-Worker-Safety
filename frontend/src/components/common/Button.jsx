import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyle = 'font-medium rounded-lg transition-all duration-150 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-slate-50 hover:bg-slate-100 text-slate-700',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    ghost: 'hover:bg-slate-100 text-slate-600'
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
