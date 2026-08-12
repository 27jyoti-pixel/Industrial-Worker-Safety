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
  TrendingUp,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Award,
  FileCheck2,
  Cpu,
  ChevronRight,
  HardHat,
  Radio,
  Zap,
  Lock,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react';

import Button from '../components/common/Button';

// Immutable & Safe Data Definitions for Industrial Command Center
const MODULES_DATA = [
  {
    title: "Accident Incident Reporting",
    tag: "CRITICAL ALERTS",
    desc: "Log shopfloor accidents in real-time with severity ratings, witness statements, geotagged timestamps, and multi-photo evidence attachments for immediate safety inspection.",
    icon: ShieldAlert,
    accentBorder: "hover:border-red-500/80",
    iconBg: "bg-red-500/10 text-red-500 border border-red-500/30",
    tagBg: "bg-red-500/20 text-red-400 border border-red-500/30",
    metric: "Sub-5 min alert dispatch"
  },
  {
    title: "Compensation Claim Audit",
    tag: "DISABILITY RELIEF",
    desc: "Streamlined compensation claim submission with medical bill tracking, statutory disability audits, officer approval trails, and transparent disbursement history.",
    icon: FileCheck2,
    accentBorder: "hover:border-yellow-500/80",
    iconBg: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30",
    tagBg: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    metric: "100% Audited workflow"
  },
  {
    title: "Safety Hazard Monitoring",
    tag: "HAZARD PREVENTION",
    desc: "File and track factory safety complaints regarding gas leaks, unshielded machinery, electrical hazards, and chemical exposures before injuries occur.",
    icon: Flame,
    accentBorder: "hover:border-orange-500/80",
    iconBg: "bg-orange-500/10 text-orange-500 border border-orange-500/30",
    tagBg: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    metric: "Zero-retaliation reporting"
  },
  {
    title: "Emergency Hospital Network",
    tag: "TRAUMA DISPATCH",
    desc: "Locate nearby industrial trauma centers, specialized burn units, and direct 108 ambulance dispatch hotlines with real-time GPS radius search.",
    icon: HeartPulse,
    accentBorder: "hover:border-emerald-500/80",
    iconBg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
    tagBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    metric: "24/7 Hotline connected"
  }
];

const WORKFLOW_STEPS_DATA = [
  {
    step: "01",
    title: "Incident Report",
    desc: "Worker or shopfloor supervisor submits digital accident report with photo evidence and severity level.",
    icon: Siren,
    tag: "Shopfloor Capture"
  },
  {
    step: "02",
    title: "Factory Verification",
    desc: "Factory administrator verifies incident details, isolates hazardous equipment, and arranges medical care.",
    icon: Factory,
    tag: "On-Site Containment"
  },
  {
    step: "03",
    title: "Government Inspection",
    desc: "State safety officer audits statutory compliance, inspects factory floor, and verifies medical expense claims.",
    icon: ShieldCheck,
    tag: "Regulatory Audit"
  },
  {
    step: "04",
    title: "Compensation Approval",
    desc: "Compensation funds are released transparently to affected worker while machine safety retrofits are verified.",
    icon: CheckCircle2,
    tag: "Relief Payout"
  }
];

const ROLES_DATA = [
  {
    role: "Industrial Worker",
    subtitle: "Frontline Protection & Rapid Relief",
    desc: "Easily report workplace hazards, file compensation claims with medical bills, track status in real-time, and locate nearest trauma hospitals.",
    badge: "WORKER PORTAL",
    icon: HardHat,
    colorTheme: "border-orange-500/40 bg-orange-500/5 text-orange-400 hover:border-orange-500",
    badgeTheme: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    focus: [
      "Incident & Hazard Logging",
      "Claim Status & Disbursement Tracker",
      "Emergency 108 Ambulance Dispatch"
    ]
  },
  {
    role: "Factory Administrator",
    subtitle: "Plant Safety Operations & Roster Control",
    desc: "Manage factory workforce, conduct on-site accident investigations, fix safety complaints, and enforce OSHA & MIDC compliance.",
    badge: "PLANT OPERATIONS",
    icon: Building2,
    colorTheme: "border-yellow-500/40 bg-yellow-500/5 text-yellow-400 hover:border-yellow-500",
    badgeTheme: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    focus: [
      "Workforce Roster Management",
      "Incident Inspection & Action Logging",
      "Hazard Mitigation Dashboard"
    ]
  },
  {
    role: "Government Safety Officer",
    subtitle: "Statutory Inspection & Claim Authorization",
    desc: "Inspect industrial facilities, audit high-severity incidents, approve compensation amounts, and enforce safety regulations.",
    badge: "GOVT AUDIT PORTAL",
    icon: Shield,
    colorTheme: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500",
    badgeTheme: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    focus: [
      "Cross-Factory Safety Audit Dashboard",
      "Compensation Claim Payout Authorization",
      "Regulatory Hazard Triage"
    ]
  },
  {
    role: "Super Administrator",
    subtitle: "Platform Governance & System Controls",
    desc: "Manage global user credentials, configure trauma hospital registries, monitor system telemetry, and maintain audit logs.",
    badge: "SYSTEM CONTROL",
    icon: Cpu,
    colorTheme: "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-600",
    badgeTheme: "bg-slate-800 text-slate-300 border-slate-700",
    focus: [
      "Global System Security & Role Access",
      "Hospital & Trauma Center Registry",
      "Platform Telemetry & Audit Logs"
    ]
  }
];

const LandingPage = () => {
  // Defensive Safe Array References
  const modules = MODULES_DATA || [];
  const workflowSteps = WORKFLOW_STEPS_DATA || [];
  const roles = ROLES_DATA || [];

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white">
      
      {/* Background Industrial Grid & Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Blueprint Metallic Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293730_1px,transparent_1px),linear-gradient(to_bottom,#1f293730_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
        
        {/* Glowing Orange & Steel Ambient Orbs */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[170px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[170px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[170px]" />
      </div>

      {/* ================= NAVBAR (DARK INDUSTRIAL GLASS) ================= */}
      <header className="sticky top-0 z-50 bg-[#080B12]/90 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center shadow-lg border border-slate-700 relative">
              <HardHat className="w-5 h-5 text-orange-500" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  Industrial Worker Safety
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold">
                  MIDC & OSHA CERTIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Factory Safety & Compensation Management System
              </p>
            </div>
          </div>

          {/* Nav Buttons (Fixed Contrast with White Text) */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-slate-800 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 45001 Industrial Safety Standard</span>
            </div>

            {/* Secondary Button: Dark glass, steel border, white text, orange hover */}
            <Link to="/login">
              <button className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 backdrop-blur-md transition-all duration-200 shadow-sm">
                Sign In
              </button>
            </Link>

            {/* Primary Button: Orange gradient, white text, orange glow */}
            <Link to="/register">
              <button className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 transition-all duration-200">
                Register Platform
              </button>
            </Link>
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION (FACTORY OPERATIONS COMMAND PANEL) ================= */}
      <section className="relative z-10 pt-8 pb-16 lg:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Animated Badges Group */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                ISO 45001 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Real-time Safety Monitoring
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
                <Siren className="w-3.5 h-3.5" />
                Emergency Response Ready
              </span>
            </div>

            {/* Industrial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Industrial Safety <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                Command Center
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Real-time accident reporting, worker compensation tracking, hazard monitoring and government compliance management across manufacturing plants and MIDC factory hubs.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/login">
                <button className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold rounded-xl text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Access Safety Command Center</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link to="/register">
                <button className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 backdrop-blur-md transition-all duration-200 flex items-center justify-center">
                  <span>Register Profile</span>
                </button>
              </Link>
            </div>

            {/* Metrics Ticker */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold mb-1">
                  <Siren className="w-3.5 h-3.5 text-orange-400" />
                  <span>Response Speed</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">&lt; 5 Mins</p>
                <p className="text-[11px] text-slate-400">Emergency Alert Dispatch</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Worker Safety Score</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">98.4%</p>
                <p className="text-[11px] text-slate-400">Zero Critical Violations</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold mb-1">
                  <Phone className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Trauma Network</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">24/7</p>
                <p className="text-[11px] text-slate-400">Ambulance Hotline 108</p>
              </div>
            </div>

          </div>

          {/* Right Column: Factory Operations Dashboard Mockup */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing Accent Ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-600/30 via-slate-800 to-emerald-600/20 blur-xl opacity-80" />

            {/* Main Operations Panel Box */}
            <div className="relative rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden">
              
              {/* Telemetry Bar */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-200">PLANT ZONE A-12 // FACTORY OPERATIONS PANEL</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  OPERATIONAL
                </span>
              </div>

              {/* Monitor Content */}
              <div className="p-5 space-y-4 font-sans text-xs">
                
                {/* Active Incident Warning Alert */}
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400">⚠️ ACTIVE INCIDENT #INC-409</span>
                      <span className="text-[10px] font-mono bg-red-500/20 px-1.5 py-0.5 rounded text-red-300">MODERATE SEVERITY</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">Press Machine #4 Pinch Injury &bull; Unit 2</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">First Aid Dispatched &bull; Logged 6 mins ago</p>
                  </div>
                </div>

                {/* Mid Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Worker Safety Score</span>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">98.4%</p>
                    <span className="text-[10px] text-slate-500">Zero Critical Violations</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Trauma Hospital Link</span>
                    <p className="text-lg font-bold text-orange-400 mt-0.5">2.4 km</p>
                    <span className="text-[10px] text-slate-500">Hotline 108 Connected</span>
                  </div>
                </div>

                {/* Compensation Claim Row */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">Claim #CLM-9042 Audit Passed</p>
                      <p className="text-[11px] text-slate-400">₹50,000 Payout Approved by Govt Officer</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    APPROVED
                  </span>
                </div>

                {/* Status Bar */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Emergency Response Status: READY</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">100% AUDITED</span>
                </div>

              </div>

            </div>

            {/* Floating Widget 1 */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl max-w-xs z-20">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5 animate-pulse text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Emergency Response</p>
                <p className="text-[11px] text-slate-400">Direct 108 Ambulance Link</p>
              </div>
            </div>

            {/* Floating Widget 2 */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl max-w-xs z-20">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">MIDC Compliance</p>
                <p className="text-[11px] text-slate-400">ISO 45001 Verified</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FEATURE MODULES SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-orange-400" />
              <span>ENTERPRISE SYSTEM MODULES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Industrial Safety Infrastructure Modules
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Replacing legacy paper forms with automated incident logging, statutory claim audit trails, hazard monitoring, and emergency medical network lookups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon || ShieldAlert;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl bg-[#0B0F19] border border-slate-800 p-6 ${mod.accentBorder || ''} transition-all duration-300 flex flex-col justify-between shadow-2xl hover:-translate-y-1`}
                >
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.iconBg || ''}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded ${mod.tagBg || ''}`}>
                        {mod.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">
                        {mod.desc}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      {mod.metric}
                    </span>
                    <Link to="/login" className="inline-flex items-center text-xs font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                      Open Module <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= WORKFLOW SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-[#080B12]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>INCIDENT PROCESS TIMELINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Industrial Incident Resolution Workflow
            </h2>
            <p className="text-slate-400 text-sm">
              Connected digital process timeline ensuring safety compliance from incident report to compensation resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws, i) => {
              const Icon = ws.icon || Siren;
              return (
                <div key={i} className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-orange-500">
                      {ws.step}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ws.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
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

      {/* ================= ROLE BASED ACCESS SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-semibold uppercase">
              <UserCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>ROLE PORTALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Tailored Portals for Every Industrial Stakeholder
            </h2>
            <p className="text-slate-400 text-sm">
              Role-adaptive dashboards with granular permissions for workers, factory admins, government officers, and super admins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, idx) => {
              const Icon = r.icon || HardHat;
              const focusItems = r.focus || [];

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-6 bg-[#0B0F19] ${r.colorTheme || 'border-slate-800'} transition duration-300 flex flex-col justify-between space-y-6 shadow-xl`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${r.badgeTheme || 'bg-slate-800 text-slate-300'}`}>
                        {r.badge || 'ROLE PORTAL'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{r.role}</h3>
                      <p className="text-xs text-orange-400 font-medium mt-0.5">{r.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {r.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capability List:</p>
                      {focusItems.map((fItem, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{fItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/login" className="w-full">
                    <button className="w-full px-4 py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/60 transition-all duration-200 text-center">
                      Login to {r.role ? r.role.split(' ')[0] : 'Portal'}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= COMPLIANCE & TRUST SECTION ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-[#080B12] border-t border-slate-800">
        <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8 text-orange-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Factories, Industrial Hubs & Govt Safety Agencies
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Empower your industrial plant with real-time hazard reporting, statutory claim auditing, and 24/7 emergency medical dispatch.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <button className="px-8 py-3.5 text-sm font-extrabold rounded-xl text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 border border-orange-400/40 shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2">
                <span>Access Safety Command Center</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <Link to="/register">
              <button className="px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-orange-500/60">
                <span>Register New Profile</span>
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#080B12] border-t border-slate-900 text-slate-500 py-10 px-4 sm:px-8 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-orange-500 font-bold">
              <HardHat className="w-4 h-4" />
            </div>
            <span className="text-slate-200 font-extrabold text-sm">Industrial Worker Safety System</span>
          </div>

          <p className="text-slate-400 font-medium">
            Industrial Worker Safety & Compensation Management System &copy; {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="/login" className="hover:text-orange-400 transition-colors">Sign In</Link>
            <span>&bull;</span>
            <Link to="/register" className="hover:text-orange-400 transition-colors">Register Account</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;