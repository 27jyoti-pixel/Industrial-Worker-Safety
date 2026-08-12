import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  HeartPulse,
  FileText,
  CheckCircle,
  ArrowRight,
  Building2,
  UserCheck,
  Activity,
  Factory,
  Siren,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Phone,
  FileCheck2,
  Cpu,
  ChevronRight,
  HardHat,
  Radio,
  Lock,
  Award
} from 'lucide-react';

import Button from '../components/common/Button';

// Static Data Definitions
const MODULES_DATA = [
  {
    title: "Accident Reporting",
    desc: "Log shopfloor incidents instantly with severity ratings and photo evidence.",
    icon: ShieldAlert,
    tag: "INCIDENTS",
    color: "border-red-500/30 text-red-400 bg-red-500/10",
    hoverGlow: "hover:border-red-500/60 hover:shadow-red-500/10"
  },
  {
    title: "Compensation Claims",
    desc: "Track statutory medical expenses and disability relief disbursements.",
    icon: FileCheck2,
    tag: "CLAIMS",
    color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    hoverGlow: "hover:border-amber-500/60 hover:shadow-amber-500/10"
  },
  {
    title: "Safety Complaints",
    desc: "Report machinery faults, gas leaks, and hazardous workplace risks.",
    icon: Flame,
    tag: "HAZARDS",
    color: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    hoverGlow: "hover:border-orange-500/60 hover:shadow-orange-500/10"
  },
  {
    title: "Hospital Network",
    desc: "Access 24/7 trauma emergency centers and ambulance dispatch hotlines.",
    icon: HeartPulse,
    tag: "EMERGENCY",
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    hoverGlow: "hover:border-emerald-500/60 hover:shadow-emerald-500/10"
  }
];

const WORKFLOW_STEPS_DATA = [
  {
    step: "01",
    title: "Incident Report",
    desc: "Worker logs shopfloor incident with injury severity and location details.",
    icon: Siren
  },
  {
    step: "02",
    title: "Factory Verification",
    desc: "Factory administrator verifies report and isolates hazardous equipment.",
    icon: Factory
  },
  {
    step: "03",
    title: "Government Inspection",
    desc: "State safety officer audits statutory compliance and approves relief.",
    icon: ShieldCheck
  },
  {
    step: "04",
    title: "Compensation Approval",
    desc: "Compensation payout is disbursed transparently to the affected worker.",
    icon: CheckCircle2
  }
];

const ROLES_DATA = [
  {
    role: "Industrial Worker",
    desc: "Log workplace incidents, submit medical claims, and access 108 emergency trauma support.",
    icon: HardHat,
    color: "border-orange-500/30 hover:border-orange-500 hover:shadow-orange-500/10",
    iconColor: "text-orange-400"
  },
  {
    role: "Factory Administrator",
    desc: "Manage workforce rosters, conduct on-site incident audits, and enforce MIDC safety standards.",
    icon: Building2,
    color: "border-amber-500/30 hover:border-amber-500 hover:shadow-amber-500/10",
    iconColor: "text-amber-400"
  },
  {
    role: "Government Safety Officer",
    desc: "Inspect industrial plants, verify disability claims, and authorize statutory compensation payouts.",
    icon: Shield,
    color: "border-emerald-500/30 hover:border-emerald-500 hover:shadow-emerald-500/10",
    iconColor: "text-emerald-400"
  },
  {
    role: "Super Administrator",
    desc: "Manage platform configurations, trauma hospital registries, and global security telemetry.",
    icon: Cpu,
    color: "border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/10",
    iconColor: "text-blue-400"
  }
];

const LandingPage = () => {
  const modules = MODULES_DATA || [];
  const workflowSteps = WORKFLOW_STEPS_DATA || [];
  const roles = ROLES_DATA || [];

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Industrial Safety Custom Animation Keyframes */}
      <style>{`
        @keyframes scanline {
          0% { top: -10%; opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-scanline {
          animation: scanline 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-float {
          animation: float-subtle 5s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background Blueprint Grid & Animated Ambient Safety Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Industrial Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Soft Radial Animated Glow Orbs */}
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[180px] animate-pulse-subtle" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[180px] animate-pulse-subtle" />
      </div>

      {/* ================= NAVBAR (GLASSMORPHISM) ================= */}
      <header className="sticky top-0 z-50 bg-[#070B12]/90 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Siemens-Style Industrial Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-orange-500/50 transition duration-300">
              <HardHat className="w-5 h-5 text-orange-500 group-hover:scale-110 transition duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  Industrial Worker Safety
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
                  MIDC & OSHA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Government & Plant Compliance Infrastructure
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <button className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-200">
                Sign In
              </button>
            </Link>

            <Link to="/register">
              <button className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-500 border border-orange-500/40 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200">
                Register Worker
              </button>
            </Link>
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 py-16 sm:py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>Industrial Safety Platform</span>
            </div>

            {/* Large Minimal Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Protecting Workers.<br />
              <span className="text-orange-500">Managing Industrial Safety.</span>
            </h1>

            {/* Short Paragraph (2 Lines Only) */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Real-time accident reporting, worker compensation tracking, hazard monitoring, and government compliance management across manufacturing plants.
            </p>

            {/* Action Buttons with Arrow Hover Motion */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/login" className="group">
                <button className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold rounded-xl text-white bg-orange-600 hover:bg-orange-500 border border-orange-500/40 shadow-xl shadow-orange-600/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Access Safety Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </button>
              </Link>

              <Link to="/register">
                <button className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center">
                  <span>Register Worker</span>
                </button>
              </Link>
            </div>

          </div>

          {/* Right Column: Animated Live Safety Telemetry Dashboard Panel */}
          <div className="lg:col-span-5 relative">
            
            {/* Soft Ambient Glow Frame */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-600/20 via-slate-800 to-emerald-600/20 blur-xl opacity-70" />

            {/* Panel Container */}
            <div className="relative rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-2xl space-y-5 overflow-hidden">
              
              {/* Vertical Laser Scanline Animation Overlay */}
              <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-scanline pointer-events-none" />

              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">PLANT ZONE A-12 // SAFETY TELEMETRY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              {/* 4 Indicators Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. Safety Score */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition duration-200">
                  <span className="text-slate-400 text-xs font-medium">Safety Score</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">98.4%</p>
                  <span className="text-[11px] text-slate-500">ISO 45001 Compliant</span>
                </div>

                {/* 2. Active Incidents */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition duration-200">
                  <span className="text-slate-400 text-xs font-medium">Active Incidents</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">0 Critical</p>
                  <span className="text-[11px] text-slate-500">1 Under Review</span>
                </div>

                {/* 3. Worker Status */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition duration-200">
                  <span className="text-slate-400 text-xs font-medium">Worker Status</span>
                  <p className="text-2xl font-black text-white mt-1">1,240</p>
                  <span className="text-[11px] text-slate-500">Monitored Active</span>
                </div>

                {/* 4. Compliance */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition duration-200">
                  <span className="text-slate-400 text-xs font-medium">Compliance</span>
                  <p className="text-2xl font-black text-orange-400 mt-1">Verified</p>
                  <span className="text-[11px] text-slate-500">MIDC Audit Passed</span>
                </div>

              </div>

              {/* Emergency Hotline Strip */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Siren className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span className="font-semibold">Trauma Hotline 108</span>
                </div>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  READY 24/7
                </span>
              </div>

            </div>

            {/* Floating Alert Widget */}
            <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl animate-float max-w-xs z-20">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Monitoring Active</p>
                <p className="text-[10px] text-slate-400">Continuous Shopfloor Protection</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= MODULE SECTION (4 INTERACTIVE CARDS) ================= */}
      <section className="relative z-10 py-20 px-6 sm:px-12 bg-[#0F172A]/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Enterprise Safety Modules
            </h2>
            <p className="text-slate-400 text-sm">
              Integrated software tools built for industrial plants and government safety departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon || ShieldAlert;
              return (
                <div
                  key={idx}
                  className={`group rounded-2xl bg-[#070B12] border border-slate-800 p-6 flex flex-col justify-between ${mod.hoverGlow} hover:-translate-y-1.5 transition-all duration-300 shadow-xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {mod.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <Link to="/login" className="inline-flex items-center text-xs font-bold text-orange-500 group-hover:text-orange-400 transition">
                      <span>Open Module</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= WORKFLOW SECTION (CONNECTED TIMELINE) ================= */}
      <section className="relative z-10 py-20 px-6 sm:px-12 bg-[#070B12]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Incident Resolution Workflow
            </h2>
            <p className="text-slate-400 text-sm">
              Standardized process timeline from shopfloor incident report to relief disbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Desktop Connected Process Line */}
            <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-orange-500/30 via-slate-800 to-emerald-500/30 -translate-y-6 z-0" />

            {workflowSteps.map((ws, i) => {
              const Icon = ws.icon || Siren;
              return (
                <div key={i} className="group relative z-10 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 space-y-3 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-orange-500 group-hover:scale-110 transition-transform">
                      {ws.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= ROLE SECTION (INTERACTIVE ROLE PORTALS) ================= */}
      <section className="relative z-10 py-20 px-6 sm:px-12 bg-[#0F172A]/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              System Access Portals
            </h2>
            <p className="text-slate-400 text-sm">
              Role-based authorization for workers, factory admins, government officers, and super admins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, idx) => {
              const Icon = r.icon || HardHat;
              return (
                <div
                  key={idx}
                  className={`group rounded-2xl border p-6 bg-[#070B12] ${r.color || 'border-slate-800'} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl`}
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-5 h-5 ${r.iconColor || 'text-white'}`} />
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {r.role}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {r.desc}
                    </p>
                  </div>

                  <Link to="/login" className="w-full">
                    <button className="w-full px-4 py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 transition duration-200">
                      Login to Portal
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#070B12] border-t border-slate-800 text-slate-500 py-10 px-6 sm:px-12 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500 font-bold">
              <HardHat className="w-4 h-4" />
            </div>
            <span className="text-slate-200 font-bold text-sm">Industrial Worker Safety System</span>
          </div>

          <p className="text-slate-400">
            Industrial Worker Safety & Compensation Management Platform &copy; {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="/login" className="hover:text-orange-500 transition">Sign In</Link>
            <span>&bull;</span>
            <Link to="/register" className="hover:text-orange-500 transition">Register Worker</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;