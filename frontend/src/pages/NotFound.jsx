import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-sand-200 shadow-lg">
        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-sand-900">404</h1>
        <h2 className="text-lg font-bold text-sand-800 mt-2">Page Not Found</h2>
        <p className="text-xs text-sand-500 mt-2 mb-6">
          The page or system resource you requested does not exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft} className="w-full">
            Back to Safety Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
