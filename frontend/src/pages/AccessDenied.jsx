import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-sand-200 shadow-lg">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-sand-900">Access Restricted</h1>
        <p className="text-xs text-sand-500 mt-2 mb-6">
          Your assigned role does not have administrative permission to view this restricted module.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft} className="w-full">
            Return to Authorized Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
