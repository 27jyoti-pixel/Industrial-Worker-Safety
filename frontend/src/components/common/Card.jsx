import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => (
  <div className={`industrial-card overflow-hidden ${className}`}>
    {(title || action) && (
      <div
        className={`px-5 sm:px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between gap-4 ${headerClassName}`}
      >
        <div className="min-w-0">
          {title && (
            <h3 className="text-[15px] font-semibold text-[#3E5C54] tracking-tight">
              {title}
            </h3>
          )}

          {subtitle && (
            <p className="text-xs text-[#6C757D] mt-1 leading-5">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    )}

    <div className={`p-5 sm:p-6 ${bodyClassName}`}>
      {children}
    </div>
  </div>
);

export default Card;