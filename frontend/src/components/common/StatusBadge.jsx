import React from 'react';

const StatusBadge = ({ status, className = '', variant }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  if (variant === 'dot') {
    const dotColors = {
      minor: '#6B9B73',
      low: '#6B9B73',
      moderate: '#C89A3C',
      medium: '#C89A3C',
      severe: '#D66A2C',
      high: '#D66A2C',
      critical: '#C94A4A',
      fatal: '#9F2F2F',
      open: '#6B9B73',
      approved: '#6B9B73',
      resolved: '#6B9B73',
      completed: '#6B9B73',
      paid: '#6B9B73',
      pending: '#C89A3C',
      submitted: '#C89A3C',
      reported: '#C89A3C',
      'in progress': '#C89A3C',
      under_review: '#718096',
      'under review': '#718096',
      'under investigation': '#718096',
      rejected: '#C94A4A',
      closed: '#6B7280'
    };

    return (
      <span className={`inline-flex items-center gap-2 text-sm font-medium text-[#252525] ${className}`}>
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dotColors[normalized] || '#6B7280' }} />
        {status}
      </span>
    );
  }

  if (variant === 'table') {
    const accentStatuses = ['open', 'reported', 'submitted', 'under review', 'under_review', 'in progress', 'in_progress', 'medium', 'moderate'];
    const strongStatuses = ['high', 'critical', 'severe', 'fatal'];
    const indicatorClass = accentStatuses.includes(normalized)
      ? 'bg-[#E87532]'
      : strongStatuses.includes(normalized)
        ? 'bg-[#4b4b4b]'
        : 'bg-[#9ca3af]';

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-[#f8f8f8] px-2 py-1 text-xs font-medium leading-4 text-[#333] ${className}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${indicatorClass}`} />
        {status}
      </span>
    );
  }

  let colorClasses = '!bg-[#F4F4F4] !text-[#495057] !border-[#D0D5D2]';

  if (['approved','resolved','completed','active','minor'].includes(normalized)) {
    colorClasses = '!bg-[#E5EEEA] !text-[#2F5D50] !border-[#AFC4BB]';
  } 
  else if (['under_review','under review','in_progress','in progress','under investigation','moderate','medium','submitted','reported','open','low'].includes(normalized)) {
    colorClasses = '!bg-[#FBF5E8] !text-[#8A6725] !border-[#E4C98B]';
  } 
  else if (['rejected','critical','fatal','severe','inactive','high'].includes(normalized)) {
    colorClasses = '!bg-[#FCEBEC] !text-[#A63D45] !border-[#E8B5BA]';
  } 
  else if (normalized === 'closed') {
    colorClasses = '!bg-[#F4F4F4] !text-[#5C6670] !border-[#D0D5D2]';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {status}
    </span>
  );
};

export default StatusBadge;
