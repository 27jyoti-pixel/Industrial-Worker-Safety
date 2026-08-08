import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, HeartPulse, FileText, CheckCircle, ArrowRight, Building2, UserCheck } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">Industrial Worker Safety</h1>
            <p className="text-xs text-slate-500 font-medium">Government & Factory Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">
              Register Account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Shield className="w-4 h-4" />
          Industrial Safety Standard Compliant
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Industrial Worker Safety & Compensation Management System
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Streamlining industrial accident reporting, compensation claim processing, safety hazard compliance, and emergency medical response across factories and government monitoring agencies.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" icon={ArrowRight}>
              Access Dashboard
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Register Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Key Platform Modules</h2>
            <p className="text-sm text-slate-500 mt-2">Comprehensive tools built for workers, admins, and officers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Accident Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log workplace incidents, severity ratings, witness statements, and attach image evidence for instant review.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Compensation Claims</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit worker compensation claims with medical expenditure tracking and government officer approval workflows.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Safety Complaints</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                File anonymous or verified safety hazard complaints regarding gas leaks, faulty machinery, or electrical hazards.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">Hospital Directory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Locate nearby emergency treatment hospitals, ambulance hotlines, and specialized trauma unit contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Role-Based System Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Worker', desc: 'File reports, track claims, view nearby emergency hospitals', icon: UserCheck },
            { role: 'Factory Admin', desc: 'Manage factory roster, inspect incidents, process claims', icon: Building2 },
            { role: 'Government Officer', desc: 'Oversee factory compliance, review high-severity cases', icon: Shield },
            { role: 'Super Admin', desc: 'Platform configuration, global user & hospital management', icon: CheckCircle }
          ].map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="p-5 bg-white rounded-xl border border-slate-200 text-center">
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">{r.role}</h4>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500">
        Industrial Worker Safety & Compensation Management System &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
