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
  const base =
    'font-semibold rounded-[14px] transition-all duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#CE93D8]/25 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#D97745] hover:bg-[#B85D35] text-white shadow-[0_8px_20px_rgba(217,119,69,.16)] hover:-translate-y-px',

    secondary:
      'bg-[#E3F1EA] hover:bg-[#D5E8DD] text-[#7B4B82]',

    outline:
      'border border-[#D8D0DB] hover:bg-[#F1DDF3] hover:border-[#CE93D8] text-[#6F4A75] bg-white',

    danger:
      'bg-[#D9534F] hover:bg-[#C74743] text-white shadow-sm',

    success:
      'bg-[#2E9B68] hover:bg-[#268458] text-white shadow-sm',

    ghost:
      'hover:bg-[#F1DDF3] text-[#6F4A75]'
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
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