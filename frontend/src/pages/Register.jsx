import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Shield,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  BadgeCheck,
  HardHat,
  Building2,
  Cpu,
  ArrowRight,
  Activity,
  Radio
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'Worker',
    role: 'Industrial Worker',
    badge: 'WORKER PORTAL',
    icon: HardHat,
    color: 'border-orange-500/40 bg-orange-500/5 text-orange-400 hover:border-orange-500',
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  {
    value: 'Factory Admin',
    role: 'Factory Administrator',
    badge: 'PLANT OPERATIONS',
    icon: Building2,
    color: 'border-amber-500/40 bg-amber-500/5 text-amber-400 hover:border-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    value: 'Government Officer',
    role: 'Government Safety Officer',
    badge: 'GOVT AUDIT PORTAL',
    icon: Shield,
    color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    value: 'Super Admin',
    role: 'Super Administrator',
    badge: 'SYSTEM GOVERNANCE',
    icon: Cpu,
    color: 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-blue-500/70',
    badgeBg: 'bg-slate-800 text-slate-300 border-slate-700'
  }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Worker',
    factoryName: '',
    employeeId: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const selectedRoleOption = ROLE_OPTIONS.find(r => r.value === formData.role) || ROLE_OPTIONS[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectRole = (roleValue) => {
    setFormData({ ...formData, role: roleValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showSuccess('Registration successful! Welcome to the platform.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic field labels based on selected role
  const getFieldLabels = () => {
    switch (formData.role) {
      case 'Factory Admin':
        return {
          name: 'Administrator Name',
          email: 'Official Email Address',
          org: 'Organization / Factory Name',
          id: 'Admin ID / Code'
        };
      case 'Government Officer':
        return {
          name: 'Officer Name',
          email: 'Government Email Address',
          org: 'Department / Agency Name',
          id: 'Officer Badge / ID #'
        };
      case 'Super Admin':
        return {
          name: 'System Admin Name',
          email: 'System Admin Email',
          org: 'System Unit / Zone',
          id: 'Admin Access Key'
        };
      default: // Worker
        return {
          name: 'Full Worker Name',
          email: 'Personal / Work Email',
          org: 'Factory Name',
          id: 'Employee ID'
        };
    }
  };

  const labels = getFieldLabels();

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Laser Scan Keyframe Overlay Style */}
      <style>{`
        @keyframes scan-laser {
          0% { top: -10%; opacity: 0; }
          25% { opacity: 0.6; }
          75% { opacity: 0.6; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-laser {
          animation: scan-laser 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Industrial Blueprint Grid & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px]" />
      </div>

      {/* ================= TOP COMMAND BAR ================= */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 text-orange-500">
            <HardHat className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-200 text-sm hidden sm:inline">
            Industrial Worker Safety Platform
          </span>
        </div>

        {/* Telemetry Status Strip */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYSTEM STATUS: ONLINE</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>REGISTRATION NETWORK: SECURE</span>
          </div>
        </div>
      </header>

      {/* ================= CENTER REGISTRATION CONSOLE ================= */}
      <main className="relative z-10 my-auto py-6 max-w-4xl mx-auto w-full">
        
        {/* Registration Console Card */}
        <div className="rounded-2xl bg-[#0A0F1D]/95 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 overflow-hidden relative">
          
          {/* Laser Scan Beam */}
          <div className="absolute left-0 right-0 h-14 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-laser pointer-events-none" />

          {/* Console Header */}
          <div className="text-center space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-mono font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHORIZED USER REGISTRATION</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Register Safety Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-md mx-auto">
              Create your authorized identity for the Industrial Worker Safety Platform
            </p>
          </div>

          {/* ROLE SELECTION CARDS */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-400" /> SELECT SYSTEM ROLE:
              </span>
              <span className="text-[11px] text-slate-500">Fields will adapt to selected role</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.role === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectRole(opt.value)}
                    className={`group p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                        : `${opt.color} bg-slate-900/60`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${opt.badgeBg}`}>
                        {opt.badge.split(' ')[0]}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {opt.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC REGISTRATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10 pt-2 border-t border-slate-800/80">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>{labels.name.toUpperCase()}</span>
                  <span className="text-[10px] text-orange-400 font-normal">REQUIRED</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>{labels.email.toUpperCase()}</span>
                  <span className="text-[10px] text-orange-400 font-normal">REQUIRED</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@factory.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Row 2: Password & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>ACCESS PASSWORD</span>
                  <span className="text-[10px] text-orange-400 font-normal">MIN 6 CHARS</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>PHONE NUMBER</span>
                  <span className="text-[10px] text-slate-500 font-normal">OPTIONAL</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Row 3: Factory / Organization & Employee ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>{labels.org.toUpperCase()}</span>
                  <span className="text-[10px] text-slate-500 font-normal">ORGANIZATION</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="factoryName"
                    value={formData.factoryName}
                    onChange={handleChange}
                    placeholder="Apex Steel Unit 4"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>{labels.id.toUpperCase()}</span>
                  <span className="text-[10px] text-slate-500 font-normal">IDENTIFIER</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <BadgeCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="EMP-1024"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Selected Role Status & Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono w-full sm:w-auto">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>SELECTED ROLE:</span>
                <span className="text-orange-400 font-semibold">{selectedRoleOption.role}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>REGISTERING...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </form>

          {/* Bottom Login Link */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80 relative z-10">
            <span>Already registered? </span>
            <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 transition">
              Sign In &rarr;
            </Link>
          </div>

        </div>
      </main>

      {/* ================= BOTTOM TELEMETRY STRIP ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full py-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">SYSTEM STATUS</span>
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">REGISTRATION NETWORK</span>
          <span className="text-white font-semibold">SECURE</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">STATUTORY AUDIT</span>
          <span className="text-white font-semibold">VERIFIED</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">SAFETY SUPPORT</span>
          <span className="text-orange-400 font-semibold">24/7 ACTIVE</span>
        </div>
      </footer>

    </div>
  );
};

export default Register;
