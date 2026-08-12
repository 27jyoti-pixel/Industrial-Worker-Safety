import React, { useState, useEffect } from 'react';
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
  Zap,
  Layers,
  Sparkles,
  Server,
  UserPlus,
  AlertTriangle
} from 'lucide-react';

import Button from '../components/common/Button';

// Static Data Definitions (Accurate & Grounded)
const SYSTEM_CAPABILITIES = [
  {
    title: "Worker Safety Profile",
    desc: "Digital worker onboarding with identity verification, factory unit assignment, and health profile logging.",
    icon: UserPlus,
    tag: "ROSTER MANAGEMENT",
    color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    hoverGlow: "hover:border-blue-500/60 hover:shadow-blue-500/10"
  },
  {
    title: "Accident Incident Reporting",
    desc: "Smart digital reporting of shopfloor accidents with injury severity ratings, time logs, and photo evidence upload.",
    icon: ShieldAlert,
    tag: "INCIDENT TRACKING",
    color: "border-red-500/30 text-red-400 bg-red-500/10",
    hoverGlow: "hover:border-red-500/60 hover:shadow-red-500/10"
  },
  {
    title: "Compensation Claim Management",
    desc: "Statutory disability claim filing with medical expense bill tracking, officer approval trails, and relief payout logs.",
    icon: FileCheck2,
    tag: "RELIEF DISBURSEMENT",
    color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    hoverGlow: "hover:border-amber-500/60 hover:shadow-amber-500/10"
  },
  {
    title: "Safety Hazard Complaints",
    desc: "Direct filing of factory risk reports regarding gas leaks, unshielded machinery, and electrical hazards.",
    icon: Flame,
    tag: "HAZARD TRIAGE",
    color: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    hoverGlow: "hover:border-orange-500/60 hover:shadow-orange-500/10"
  },
  {
    title: "Emergency Hospital Support",
    desc: "GPS radius directory of nearby industrial trauma centers, specialized burn units, and 108 ambulance dispatch link.",
    icon: HeartPulse,
    tag: "24/7 TRAUMA NETWORK",
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    hoverGlow: "hover:border-emerald-500/60 hover:shadow-emerald-500/10"
  }
];

const PIPELINE_STEPS_DATA = [
  {
    step: "01",
    title: "Incident Reporting",
    desc: "Worker or supervisor files digital accident report with injury severity rating and photo evidence.",
    icon: Siren,
    status: "Digital Log"
  },
  {
    step: "02",
    title: "Factory Verification",
    desc: "Plant administrator verifies incident details, isolates hazard zone, and logs immediate safety response.",
    icon: Factory,
    status: "On-Site Review"
  },
  {
    step: "03",
    title: "Emergency Medical Support",
    desc: "Trauma hospital directory search and 108 emergency ambulance hotline dispatch for critical care.",
    icon: HeartPulse,
    status: "Care Dispatched"
  },
  {
    step: "04",
    title: "Government Compliance Review",
    desc: "State safety officer reviews statutory compliance, inspects factory floor, and audits medical bills.",
    icon: ShieldCheck,
    status: "Statutory Audit"
  },
  {
    step: "05",
    title: "Compensation Settlement",
    desc: "Approved relief funds are disbursed transparently to the affected worker while safety retrofits are certified.",
    icon: CheckCircle2,
    status: "Payout Complete"
  }
];

const ROLES_DATA = [
  {
    role: "Industrial Worker",
    desc: "Log workplace accidents, submit medical expense claims, report hazards, and access emergency trauma support.",
    icon: HardHat,
    badge: "WORKER PORTAL",
    color: "border-orange-500/30 hover:border-orange-500/80 hover:shadow-orange-500/15",
    iconColor: "text-orange-400",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  },
  {
    role: "Factory Administrator",
    desc: "Manage worker rosters, conduct on-site incident investigations, log safety actions, and maintain statutory standards.",
    icon: Building2,
    badge: "PLANT OPERATIONS",
    color: "border-amber-500/30 hover:border-amber-500/80 hover:shadow-amber-500/15",
    iconColor: "text-amber-400",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    role: "Government Safety Officer",
    desc: "Audit plant safety compliance, inspect high-severity workplace incidents, and authorize statutory compensation payouts.",
    icon: Shield,
    badge: "GOVT AUDIT PORTAL",
    color: "border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-emerald-500/15",
    iconColor: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    role: "Super Administrator",
    desc: "Platform governance over user role authorizations, trauma hospital registries, and system audit logs.",
    icon: Cpu,
    badge: "SYSTEM GOVERNANCE",
    color: "border-slate-700 hover:border-blue-500/70 hover:shadow-blue-500/15",
    iconColor: "text-blue-400",
    badgeBg: "bg-slate-800 text-slate-300 border-slate-700"
  }
];

const SAFETY_ZONES_DATA = [
  { id: "ZONE-A", name: "Plant Floor Unit 4", status: "Verified Safe", incidents: "0 Critical", workers: 142, score: "99.1%" },
  { id: "ZONE-B", name: "Chemical Handling Unit", status: "Under Review", incidents: "1 Hazard Logged", workers: 88, score: "96.4%" },
  { id: "ZONE-C", name: "Assembly & Fabrication", status: "Verified Safe", incidents: "Zero Incidents", workers: 310, score: "99.8%" },
  { id: "ZONE-D", name: "Power Grid Substation", status: "Audit Passed", incidents: "Normal Load", workers: 45, score: "98.7%" }
];

const RECENT_EVENTS_LOG = [
  { id: "EVT-801", time: "10:42 AM", msg: "Shopfloor Hazard Report #CMP-109 Resolved by Plant Admin", status: "RESOLVED", color: "text-emerald-400" },
  { id: "EVT-802", time: "10:38 AM", msg: "Compensation Claim #CLM-9042 (₹50,000) Approved by State Officer", status: "APPROVED", color: "text-amber-400" },
  { id: "EVT-803", time: "10:15 AM", msg: "Accident Report #INC-409 Investigated & First Aid Logged", status: "AUDITED", color: "text-emerald-400" },
  { id: "EVT-804", time: "09:50 AM", msg: "Emergency Trauma Hospital Dispatch Linked with 108 Ambulance", status: "ACTIVE", color: "text-blue-400" }
];

const LandingPage = () => {
  const capabilities = SYSTEM_CAPABILITIES || [];
  const pipelineSteps = PIPELINE_STEPS_DATA || [];
  const roles = ROLES_DATA || [];
  const safetyZones = SAFETY_ZONES_DATA || [];
  const recentLogs = RECENT_EVENTS_LOG || [];

  const [workerCount, setWorkerCount] = useState(1240);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setActiveLogIndex(prev => (prev + 1) % recentLogs.length);
    }, 3800);
    return () => clearInterval(logInterval);
  }, [recentLogs.length]);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Refined Industrial Telemetry Animations */}
      <style>{`
        @keyframes scanline-radar {
          0% { top: -10%; opacity: 0; }
          25% { opacity: 0.7; }
          75% { opacity: 0.7; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes float-panel {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-radar {
          animation: scanline-radar 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-float-panel {
          animation: float-panel 6s ease-in-out infinite;
        }
      `}</style>

      {/* Industrial Blueprint Grid & Soft Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[190px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[190px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[190px]" />
      </div>

      {/* ================= NAVBAR (STICKY GLASS) ================= */}
      <header className="sticky top-0 z-50 bg-[#050811]/90 backdrop-blur-xl border-b border-slate-800/90 px-6 sm:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-orange-500/60 transition duration-300 relative shadow-inner">
              <HardHat className="w-5 h-5 text-orange-500 group-hover:scale-105 transition duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-white tracking-tight text-base">
                  Industrial Worker Safety
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-semibold">
                  <Activity className="w-3 h-3 animate-pulse" /> INDUSTRIAL SAFETY MANAGEMENT PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                Worker Safety & Compensation Management System
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-slate-800 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SAFETY SYSTEM: ACTIVE</span>
            </div>

            <Link to="/login">
              <button className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-200 shadow-sm">
                Sign In
              </button>
            </Link>

            <Link to="/register">
              <button className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-lg shadow-orange-600/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200">
                Register Worker
              </button>
            </Link>
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 py-12 sm:py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-mono shadow-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-orange-400 font-semibold">INDUSTRIAL SAFETY COMMAND</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">WORKER PROTECTION & COMPLIANCE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.14]">
              Protecting Workers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 font-bold">
                Digitizing Industrial Safety.
              </span>
            </h1>

            {/* Concise Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Digital safety management for factory workers, plant administrators, and government safety officers — integrating accident reporting, compensation claim auditing, and hazard triage.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/login" className="group">
                <button className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-xl shadow-orange-600/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Access Safety Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link to="/register">
                <button className="w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-medium rounded-xl text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center">
                  <span>Register Worker</span>
                </button>
              </Link>
            </div>

            {/* Ticker Metrics */}
            <div className="pt-6 border-t border-slate-800/90 grid grid-cols-3 gap-4 font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">ACTIVE WORKERS</span>
                <span className="text-lg sm:text-xl font-bold text-white mt-0.5 block">{workerCount.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400">12 Plants Monitored</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">SAFETY RATING</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5 block">98.4%</span>
                <span className="text-[10px] text-slate-400">ISO 45001 Verified</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">RESPONSE TIME</span>
                <span className="text-lg sm:text-xl font-bold text-orange-400 mt-0.5 block">&lt; 4.8 Mins</span>
                <span className="text-[10px] text-slate-400">Hotline 108 Active</span>
              </div>
            </div>

          </div>

          {/* Right Column: Refocused Worker Safety Command Telemetry Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-600/20 via-slate-800 to-emerald-600/20 blur-xl opacity-70" />

            {/* Dashboard Box */}
            <div className="relative rounded-2xl bg-[#0A0F1D] border border-slate-800 p-5 shadow-2xl space-y-4 overflow-hidden backdrop-blur-xl">
              
              {/* Radar Scanline Overlay */}
              <div className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-orange-500/15 to-transparent animate-radar pointer-events-none" />

              {/* Monitor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-slate-200">WORKER SAFETY TELEMETRY</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SYSTEM ACTIVE
                </span>
              </div>

              {/* Active Incident Warning Alert */}
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400">INCIDENT LOG #INC-409</span>
                    <span className="text-[10px] font-mono bg-red-500/20 px-1.5 py-0.5 rounded text-red-300">MODERATE SEVERITY</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">Press Machine #4 Pinch Injury &bull; Unit 2</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">First Aid Dispatched &bull; Logged 6 mins ago</p>
                </div>
              </div>

              {/* 4 Focused Indicators Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Worker Safety Score</span>
                  <p className="text-xl font-bold text-emerald-400 mt-0.5">98.4%</p>
                  <span className="text-[10px] text-slate-500">Zero Critical Violations</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Emergency Support</span>
                  <p className="text-xl font-bold text-orange-400 mt-0.5">Active</p>
                  <span className="text-[10px] text-slate-500">Trauma Network Connected</span>
                </div>
              </div>

              {/* Compensation Claim Telemetry Row */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-slate-200 text-[11px]">Claim #CLM-9042 Payout</p>
                    <p className="text-[10px] text-slate-400">₹50,000 Approved by Govt Officer</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AUDITED
                </span>
              </div>

              {/* Emergency Hotline Status */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Siren className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span className="font-medium text-[11px]">Trauma Hotline 108 Support</span>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">CONNECTED 24/7</span>
              </div>

            </div>

            {/* Floating Alert Widget */}
            <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl animate-float-panel max-w-xs z-20">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Worker Protection Active</p>
                <p className="text-[10px] text-slate-400">Statutory Compliance Verified</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION 5: WORKER PROTECTION CAPABILITIES SECTION ================= */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-mono mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>CORE PLATFORM CAPABILITIES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Integrated Worker Protection System
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-normal">
              Digital safety tools connecting workers, plant managers, state inspectors, and emergency hospitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon || ShieldAlert;
              return (
                <div
                  key={idx}
                  className={`group rounded-2xl bg-[#0A0F1D] border border-slate-800/80 p-5 flex flex-col justify-between ${cap.hoverGlow} hover:-translate-y-1 transition-all duration-200 shadow-xl`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cap.color} group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                        {cap.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                        {cap.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <Link to="/login" className="inline-flex items-center text-[11px] font-medium text-orange-500 group-hover:text-orange-400 transition">
                      <span>Open Module</span>
                      <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= SECTION 4: INDUSTRIAL SAFETY MONITORING GRID ================= */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-[#050811]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-mono mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>FACTORY SAFETY ZONES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Industrial Safety Monitoring Grid
              </h2>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm font-normal max-w-md">
              Real-time safety monitoring across factory plant zones, incident status, and compliance reports.
            </p>
          </div>

          {/* Safety Zones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {safetyZones.map((sz, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0A0F1D] border border-slate-800/90 p-5 space-y-4 shadow-xl hover:border-slate-700 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {sz.id}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {sz.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">{sz.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{sz.incidents}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">ACTIVE WORKERS</span>
                    <span className="font-bold text-white">{sz.workers}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">SAFETY RATING</span>
                    <span className="font-bold text-emerald-400">{sz.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Incident Event Feed Stream */}
          <div className="p-4 rounded-2xl bg-[#0A0F1D] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs shadow-inner">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-slate-900 text-orange-400 border border-slate-700 text-[10px] font-bold shrink-0">
                LIVE LOG FEED
              </span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-500">[{recentLogs[activeLogIndex].time}]</span>
                <span className="text-slate-200 font-sans truncate max-w-xl">{recentLogs[activeLogIndex].msg}</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 shrink-0 ${recentLogs[activeLogIndex].color}`}>
              {recentLogs[activeLogIndex].status}
            </span>
          </div>

        </div>
      </section>

      {/* ================= OPERATIONAL SAFETY PIPELINE ================= */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Operational Incident Workflow
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-normal">
              Standardized process timeline from shopfloor incident report to compensation settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            
            {/* Desktop Progress Track Line */}
            <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-orange-500/25 via-slate-800 to-emerald-500/25 -translate-y-5 z-0" />

            {pipelineSteps.map((ps, i) => {
              const Icon = ps.icon || Siren;
              return (
                <div key={i} className="group relative z-10 rounded-2xl bg-[#0A0F1D] border border-slate-800 p-4 space-y-3 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold font-mono text-orange-500 group-hover:scale-105 transition-transform">
                      {ps.step}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {ps.status}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {ps.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    {ps.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= ROLE ACCESS CONTROL PORTALS ================= */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-[#050811] border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Role Access Portals
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-normal">
              Role-adaptive authorization for workers, factory administrators, government safety officers, and super admins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map((r, idx) => {
              const Icon = r.icon || HardHat;
              return (
                <div
                  key={idx}
                  className={`group rounded-2xl border p-5 bg-[#0A0F1D] ${r.color || 'border-slate-800'} hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-xl`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200">
                        <Icon className={`w-4 h-4 ${r.iconColor || 'text-white'}`} />
                      </div>
                      <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${r.badgeBg || 'bg-slate-900 text-slate-300'}`}>
                        {r.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white">
                      {r.role}
                    </h3>

                    <p className="text-xs text-slate-400 font-normal leading-relaxed">
                      {r.desc}
                    </p>
                  </div>

                  <Link to="/login" className="w-full">
                    <button className="w-full px-3.5 py-2 text-xs font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 transition duration-200">
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
      <footer className="relative z-10 bg-[#050811] border-t border-slate-800 text-slate-500 py-8 px-6 sm:px-12 text-center text-xs font-normal">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500 font-semibold">
              <HardHat className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-200 font-semibold text-xs">Industrial Worker Safety System</span>
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