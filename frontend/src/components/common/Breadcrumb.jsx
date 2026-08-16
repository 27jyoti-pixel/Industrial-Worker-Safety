import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-sand-500 mb-4 overflow-x-auto py-1">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-sand-400 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-brand-600 transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-sand-700 whitespace-nowrap">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
