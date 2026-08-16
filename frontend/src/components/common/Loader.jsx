import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, text = 'Loading data...' }) => {
  if (fullPage) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <Loader2 className="w-9 h-9 text-brand-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-sand-600">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 gap-2">
      <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
      <span className="text-sm text-sand-600 font-medium">{text}</span>
    </div>
  );
};

export default Loader;
