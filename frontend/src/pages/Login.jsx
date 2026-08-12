import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Shield,
  Lock,
  Mail,
  UserCheck,
  HardHat,
  Building2,
  Cpu,
  Activity,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Server
} from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ROLE_PRESETS = [
  {
    id: "worker",
    role: "Industrial Worker",
    email: "worker@industrial.com",
    badge: "WORKER PORTAL",
    capabilities: "Report incidents, track compensation, access safety services",
    icon: HardHat,
    color: "border-orange-500/40 bg-orange-500/5 text-orange-400 hover:border-orange-500",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  },
  {
    id: "admin",
    role: "Factory Administrator",
    email: "admin@factory.com",
    badge: "PLANT OPERATIONS",
    capabilities: "Manage workers, verify incidents, monitor plant safety",
    icon: Building2,
    color: "border-amber-500/40 bg-amber-500/5 text-amber-400 hover:border-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    id: "officer",
    role: "Government Safety Officer",
    email: "officer@gov.in",
    badge: "GOVT AUDIT PORTAL",
    capabilities: "Audit compliance, review incidents, approve claims",
    icon: Shield,
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    id: "superadmin",
    role: "Super Administrator",
    email: "superadmin@system.com",
    badge: "SYSTEM GOVERNANCE",
    capabilities: "Manage platform, control access, view analytics",
    icon: Cpu,
    color: "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-blue-500/70",
    badgeBg: "bg-slate-800 text-slate-300 border-slate-700"
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLE_PRESETS[0]);

  const { login, token } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') {
      showWarning('Your session has expired. Please authenticate again.');
    }
  }, [token, navigate, location, showWarning]);

  // Handle Quick Role Preset Selection
  const handleSelectRole = (preset) => {
    setSelectedRole(preset);
    setEmail(preset.email);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError('Please enter both employee/organization ID and password.');
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      showSuccess(`Authenticated successfully: ${user.name} (${user.role})`);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Laser Scan Keyframe Style */}
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

      {/* Blueprint Grid & Industrial Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px]" />
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
            <span>SAFETY NETWORK: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* ================= CENTER AUTHENTICATION CONSOLE ================= */}
      <main className="relative z-10 my-auto py-6 max-w-4xl mx-auto w-full">
        
        {/* Main Command Console Card */}
        <div className="rounded-2xl bg-[#0A0F1D]/95 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 overflow-hidden relative">
          
          {/* Laser Scan Overlay */}
          <div className="absolute left-0 right-0 h-14 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-laser pointer-events-none" />

          {/* Console Header */}
          <div className="text-center space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-mono font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE SYSTEM LOGIN</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Industrial Safety Portal Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-md mx-auto">
              Sign in to access your authorized safety management dashboard
            </p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-400" /> SELECT YOUR ROLE:
              </span>
              <span className="text-[11px] text-slate-500">Click role card to load authorization</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {ROLE_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedRole?.id === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectRole(preset)}
                    className={`group p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                        : `${preset.color} bg-slate-900/60`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border ${preset.badgeBg}`}>
                        {preset.badge.split(' ')[0]}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {preset.role}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1 font-sans font-normal">
                        {preset.capabilities}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC LOGIN PANEL FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10 pt-2 border-t border-slate-800/80">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Employee / Org ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>EMPLOYEE / ORGANIZATION ID</span>
                  <span className="text-[10px] text-orange-400 font-normal">REQUIRED</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@industrial.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>SECURE ACCESS PASSWORD</span>
                  <span className="text-[10px] text-orange-400 font-normal">ENCRYPTED</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Selected Role Indicator & Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono w-full sm:w-auto">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>ROLE:</span>
                <span className="text-orange-400 font-semibold">{selectedRole.role}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </form>

          {/* Registration Link */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80 relative z-10">
            <span>New user? </span>
            <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300 transition">
              Create Safety Profile &rarr;
            </Link>
          </div>

        </div>
      </main>

      {/* ================= BOTTOM SYSTEM INFORMATION TELEMETRY STRIP ================= */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full py-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">SYSTEM STATUS</span>
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">ACTIVE WORKERS</span>
          <span className="text-white font-semibold">1,240</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">CONNECTED PLANTS</span>
          <span className="text-white font-semibold">12</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">SAFETY NETWORK</span>
          <span className="text-orange-400 font-semibold">ACTIVE</span>
        </div>
      </footer>

    </div>
  );
};

export default Login;