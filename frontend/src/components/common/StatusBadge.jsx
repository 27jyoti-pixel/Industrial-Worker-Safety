import React from 'react';

const StatusBadge = ({ status, type = 'status', className = '' }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (
    normalized === 'approved' ||
    normalized === 'resolved' ||
    normalized === 'completed' ||
    normalized === 'active' ||
    normalized === 'minor'
  ) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (
    normalized === 'under_review' ||
    normalized === 'under review' ||
    normalized === 'in_progress' ||
    normalized === 'in progress' ||
    normalized === 'under investigation' ||
    normalized === 'moderate' ||
    normalized === 'medium'
  ) {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (
    normalized === 'rejected' ||
    normalized === 'critical' ||
    normalized === 'fatal' ||
    normalized === 'severe' ||
    normalized === 'inactive' ||
    normalized === 'high'
  ) {
    colorClasses = 'bg-red-50 text-red-700 border-red-200';
  } else if (
    normalized === 'submitted' ||
    normalized === 'reported' ||
    normalized === 'open' ||
    normalized === 'low'
  ) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (normalized === 'closed') {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
