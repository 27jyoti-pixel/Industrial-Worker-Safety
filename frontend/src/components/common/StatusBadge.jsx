import React from 'react';

const StatusBadge = ({ status, className='' }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

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