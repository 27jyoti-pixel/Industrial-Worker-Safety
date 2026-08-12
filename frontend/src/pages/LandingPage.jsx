import React, { useState } from 'react';
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
  Zap,
  Clock,
  Sparkles,
  Radio,
  Award,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  MapPin,
  Phone,
  ShieldCheck,
  FileCheck2,
  Flame,
  Cpu,
  Lock
} from 'lucide-react';

import Button from '../components/common/Button';

const LandingPage = () => {
  const [activeRoleTab, setActiveRoleTab] = useState(0);

  const modules = [
    {
      title: "Accident Incident Reporting",
      tag: "REAL-TIME LOGGING",
      desc: "Log workplace incidents instantly with severity ratings, witness statements, geotagging, and photo evidence attachments for immediate safety inspection.",
      icon: ShieldAlert,
      accentColor: "border-red-500/30 text-red-500 bg-red-500/10",
      badgeBg: "bg-red-500/20 text-red-400 border-red-500/30",
      stats: "Sub-5 min logging"
    },
    {
      title: "Compensation Claim Audit",
      tag: "FINANCIAL RELIEF",
      desc: "Streamlined multi-stage compensation claims with medical bill tracking, statutory disability audits, transparent approval history, and direct disbursements.",
      icon: FileCheck2,
      accentColor: "border-blue-500/30 text-blue-500 bg-blue-500/10",
      badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      stats: "100% Transparent"
    },
    {
      title: "Safety Hazard Complaints",
      tag: "PREVENTIVE RISK LOGS",
      desc: "File and track industrial risk complaints regarding gas leaks, unshielded machinery, electrical hazards, and hazardous chemical exposures before incidents occur.",
      icon: Flame,
      accentColor: "border-amber-500/30 text-amber-500 bg-amber-500/10",
      badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      stats: "Zero-retaliation reporting"
    },
    {
      title: "Emergency Hospital Directory",
      tag: "TRAUMA RESPONSE",
      desc: "Locate nearby 24/7 emergency trauma centers, specialized burn units, and direct ambulance dispatch hotlines with real-time GPS radius search.",
      icon: HeartPulse,
      accentColor: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
      badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      stats: "24/7 Hotlines"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Hazard / Incident Logged",
      desc: "Workers or supervisors submit digital report with photos, time logs, and injury severity classification.",
      icon: Siren,
      tag: "Instant Capture"
    },
    {
      step: "02",
      title: "Factory Admin Audit",
      desc: "Factory managers review report authenticity, dispatch emergency medical care, and isolate workplace hazards.",
      icon: Factory,
      tag: "On-site Verification"
    },
    {
      step: "03",
      title: "Government Inspector Review",
      desc: "State safety officers audit incident severity, compliance records, and approve compensation claim amounts.",
      icon: ShieldCheck,
      tag: "Statutory Approval"
    },
    {
      step: "04",
      title: "Disbursement & Resolution",
      desc: "Compensation funds are released transparently to affected workers while corrective safety measures are verified.",
      icon: CheckCircle2,
      tag: "Closure & Relief"
    }
  ];

  const roles = [
    {
      title: "Industrial Worker",
      subtitle: "Frontline Protection & Rapid Relief",
      desc: "Easily report workplace hazards, file compensation claims with medical bills, track status in real-time, and locate nearest emergency hospitals instantly.",
      icon: UserCheck,
      color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
      highlights: [
        "1-Click Incident & Injury Reporting",
        "Direct Claim & Reimbursement Tracker",
        "Emergency 108 Ambulance Dispatch Map"
      ]
    },
    {
      title: "Factory Administrator",
      subtitle: "On-Site Risk Control & Compliance",
      desc: "Manage factory rosters, investigate reported incidents, verify compensation requests, assign maintenance crews, and enforce OSHA/MIDC compliance.",
      icon: Building2,
      color: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30",
      highlights: [
        "Workforce Safety Roster Management",
        "Incident Inspection & Action Logging",
        "Corrective Hazard Resolution Dashboard"
      ]
    },
    {
      title: "Government Safety Officer",
      subtitle: "Statutory Oversight & Audit Authority",
      desc: "Inspect industrial plants, audit severity reports, verify disability assessments, approve compensation allocations, and ensure legal factory compliance.",
      icon: Shield,
      color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30",
      highlights: [
        "Cross-Factory Safety Audit Dashboard",
        "Compensation Claim Authorization Flow",
        "Regulatory Hazard Triage System"
      ]
    },
    {
      title: "Super Administrator",
      subtitle: "Platform Governance & System Controls",
      desc: "Manage global user credentials, configure industrial hospital directories, monitor system health stats, and maintain data security standards.",
      icon: Cpu,
      color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30",
      highlights: [
        "Global System Security & Role Control",
        "Hospital & Trauma Center Registry",
        "Full Audit Logs & Platform Telemetry"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/20 border border-blue-400/30 relative">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white tracking-tight text-base sm:text-lg">
                  Industrial Worker Safety
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                  PRO SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Compensation & Safety Command Platform
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 pr-4 border-r border-slate-800 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 45001 & MIDC Compliant</span>
            </div>

            <Link to="/login">
              <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white">
                Sign In
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30">
                Register Platform
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* ================= HERO SECTION (SPLIT SCREEN COMMAND CENTER) ================= */}
      <section className="relative z-10 pt-8 pb-16 lg:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-400 text-xs font-semibold backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="tracking-wide">INDUSTRIAL SAFETY & COMPENSATION COMMAND</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Next-Gen Industrial <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                Worker Protection
              </span> &<br />
              Crisis Management
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Unified digital platform connecting industrial workers, factory managers, healthcare providers, and government safety officers for instant accident reporting, transparent compensation claim audits, and 24/7 emergency response.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 border border-blue-400/40 px-8 py-3.5">
                  <span>Access Safety Command Center</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white px-7 py-3.5 backdrop-blur-md">
                  <span>Register Account</span>
                </Button>
              </Link>
            </div>

            {/* Ticker Key Metrics */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Response Time</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">&lt; 5 Mins</p>
                <p className="text-[11px] text-slate-400">Accident Alert Dispatch</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Claim Transparency</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">100%</p>
                <p className="text-[11px] text-slate-400">Audited Audit Trail</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold mb-1">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>Hospital Radius</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">24/7</p>
                <p className="text-[11px] text-slate-400">Trauma Hotline 108</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column (Interactive Industrial Dashboard Visualization Mockup) */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing Accent Ring Behind Mockup */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-orange-500/30 blur-2xl opacity-75" />

            {/* Main Command Dashboard Window Card */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">SYSTEM // MONITOR_V4.2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">LIVE FEED</span>
                </div>
              </div>

              {/* Dashboard Content Mock */}
              <div className="p-5 space-y-4 font-sans text-xs">
                
                {/* Header Stats Strip */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[11px]">Factory Health Index</p>
                      <p className="text-lg font-bold text-emerald-400">98.6%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[11px]">Emergency Status</p>
                      <p className="text-lg font-bold text-orange-400">READY (108)</p>
                    </div>
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Siren className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Realtime Safety Ticker Feed */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px] px-1">
                    <span>LIVE SAFETY ACTIVITY LOG</span>
                    <span className="text-blue-400">UPDATED JUST NOW</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 text-xs">Accident Report #INC-4029</p>
                        <p className="text-[11px] text-slate-400">Assembly Bay 4 &bull; Moderate Injury Logged</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      UNDER INVESTIGATION
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 text-xs">Claim #CLM-8921 Approved</p>
                        <p className="text-[11px] text-slate-400">₹45,000 Disbursement Authorized</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      APPROVED
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <HeartPulse className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200 text-xs">Trauma Center Dispatch</p>
                        <p className="text-[11px] text-slate-400">Emergency Unit Connected &bull; 2.4 km</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Footer Bar inside Mockup */}
                <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Role-Based Access Control Enabled</span>
                  </div>
                  <span className="text-blue-400 font-bold">4 Active Roles</span>
                </div>

              </div>
            </div>

            {/* Floating Info Overlay Badge 1 */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl max-w-xs z-20">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Emergency 108 Integration</p>
                <p className="text-[11px] text-slate-400">Direct Trauma Center Hotlines</p>
              </div>
            </div>

            {/* Floating Info Overlay Badge 2 */}
            <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl max-w-xs z-20">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Statutory Compliance</p>
                <p className="text-[11px] text-slate-400">Factories Act & MIDC Compliant</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= PLATFORM MODULES SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              CORE INDUSTRIAL SAFETY SUITE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Integrated Modules Designed for High-Risk Industries
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Replacing legacy paper forms with instant digital workflows, auditable financial compensation, and real-time medical directory lookups.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl bg-slate-950/80 border border-slate-800 p-6 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-4">
                    
                    {/* Top Icon Bar */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${mod.accentColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${mod.badgeBg}`}>
                        {mod.tag}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {mod.stats}
                    </span>
                    <Link to="/login" className="inline-flex items-center text-xs font-bold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                      Access <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= WORKFLOW PIPELINE SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              END-TO-END SAFETY WORKFLOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Incident Resolution Works
            </h2>
            <p className="text-slate-400 text-sm">
              Transparent 4-step pipeline ensuring no safety risk goes unaddressed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflowSteps.map((ws, i) => {
              const Icon = ws.icon;
              return (
                <div key={i} className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-md space-y-4 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-orange-500/80">
                      {ws.step}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ws.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
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

      {/* ================= ROLE-BASED ACCESS MATRIX SECTION ================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-slate-900/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              ROLE-BASED AUTHORIZATION MATRIX
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Tailored Portals for Every Stakeholder
            </h2>
            <p className="text-slate-400 text-sm">
              Custom dashboard interfaces and granular permissions based on system role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-6 bg-gradient-to-b ${r.color} backdrop-blur-md flex flex-col justify-between space-y-6 hover:shadow-2xl transition duration-300`}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{r.title}</h3>
                      <p className="text-xs text-blue-300 font-medium mt-0.5">{r.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {r.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-800/60 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capabilities:</p>
                      {r.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-slate-700 bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white justify-center">
                      Login as {r.title.split(' ')[0]}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= COMPLIANCE & TRUST SECTION ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/20 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Upgrade Your Industrial Safety Ecosystem?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Empower your workforce with real-time hazard reporting, transparent claims auditing, and statutory government compliance monitoring.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-600/30 border border-blue-400/40 px-8 py-3.5">
                <span>Access Dashboard Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link to="/register">
              <Button variant="outline" size="lg" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-7 py-3.5">
                <span>Create User Profile</span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-900 text-slate-500 py-10 px-4 sm:px-8 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-slate-200 font-bold text-sm">Industrial Worker Safety System</span>
          </div>

          <p className="text-slate-400">
            Industrial Worker Safety & Compensation Management Platform &copy; {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="/login" className="hover:text-blue-400 transition-colors">Sign In</Link>
            <span>&bull;</span>
            <Link to="/register" className="hover:text-blue-400 transition-colors">Register Profile</Link>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;