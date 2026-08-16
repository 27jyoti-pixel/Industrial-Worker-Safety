import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';

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
  Factory,
  CircleCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';

const ROLE_OPTIONS = [
  {
    value: 'Worker',
    role: 'Industrial Worker',
    badge: 'WORKER PORTAL',
    icon: HardHat,
    color:
      'border-[#3E5C54]/40 bg-[#3E5C54]/5 text-[#3E5C54] hover:border-[#3E5C54]',
    badgeBg:
      'bg-[#3E5C54]/10 text-[#3E5C54] border-[#3E5C54]/20'
  },
  {
    value: 'Factory Admin',
    role: 'Factory Administrator',
    badge: 'PLANT OPERATIONS',
    icon: Building2,
    color:
      'border-[#C9A66B]/40 bg-[#C9A66B]/5 text-[#9A7436] hover:border-[#C9A66B]',
    badgeBg:
      'bg-[#C9A66B]/10 text-[#9A7436] border-[#C9A66B]/20'
  },
  {
    value: 'Government Officer',
    role: 'Government Safety Officer',
    badge: 'GOVT AUDIT PORTAL',
    icon: Shield,
    color:
      'border-[#2A9D8F]/40 bg-[#2A9D8F]/5 text-[#2A9D8F] hover:border-[#2A9D8F]',
    badgeBg:
      'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20'
  },
  {
    value: 'Super Admin',
    role: 'Super Administrator',
    badge: 'SYSTEM GOVERNANCE',
    icon: Cpu,
    color:
      'border-[#E0E0E0] bg-[#1E1E1E]/80 text-[#F4F4F4] hover:border-[#3E5C54]/70',
    badgeBg:
      'bg-[#3E5C54] text-[#F4F4F4] border-[#E0E0E0]'
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

  const selectedRoleOption =
    ROLE_OPTIONS.find((r) => r.value === formData.role) ||
    ROLE_OPTIONS[0];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectRole = (roleValue) => {
    setFormData({
      ...formData,
      role: roleValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      showError('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);

      showSuccess(
        'Registration successful! Welcome to the platform.'
      );

      navigate('/dashboard');
    } catch (err) {
      showError(
        err.message ||
          'Registration failed. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

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
          id: 'Officer Badge / ID'
        };

      case 'Super Admin':
        return {
          name: 'System Admin Name',
          email: 'System Admin Email',
          org: 'System Unit / Zone',
          id: 'Admin Access Key'
        };

      default:
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
    <div className="register-page-enter public-canvas
      
      <style>{`
        .register-page-enter {
          animation: registerPageEnter 0.45s ease-out both;
        }
      
        @keyframes registerPageEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      
        @media (prefers-reduced-motion: reduce) {
          .register-page-enter {
            animation: none;
          }
        }
      `}</style> min-h-screen flex items-start lg:items-center justify-center p-3 sm:p-4 lg:p-5">
      <div className="public-window w-full max-w-[1380px] min-h-[680px] grid lg:grid-cols-[0.92fr_1.08fr] overflow-hidden">

        {/* ================= LEFT INDUSTRIAL VISUAL ================= */}
        <section className="auth-visual hidden lg:flex relative flex-col overflow-hidden">

          {/* soft industrial background */}
          <div className="absolute inset-0 bg-[#EEF2F0]" />
          <div className="absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-[#E1ECE8]" />
          <div className="absolute -bottom-28 -right-24 w-[390px] h-[390px] rounded-full bg-[#F3E7D6]" />
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#B9C9C3_1px,transparent_1px)] [background-size:18px_18px]" />

          {/* brand */}
          <Link
            to="/"
            className="relative z-20 flex items-center gap-3 w-fit px-7 pt-7"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F4F4F4] text-[#3E5C54] flex items-center justify-center shadow-sm">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-[#1E1E1E]">
                MIDC Safety
              </div>
              <div className="text-[10px] text-[#6C757D] mt-0.5">
                Industrial worker protection
              </div>
            </div>
          </Link>

          {/* rotating industrial scene */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-10 py-8">
            <div className="relative w-[430px] h-[430px]">

              {/* orbit rings */}
              <div className="absolute inset-[18px] rounded-full border border-[#C9D8D2]" />
              <div className="absolute inset-[52px] rounded-full border border-dashed border-[#B9C9C3] animate-[spin_22s_linear_infinite]" />
              <div className="absolute inset-[92px] rounded-full border border-[#E0E0E0]" />

              {/* rotating industry tiles */}
              <div className="absolute inset-0 animate-[spin_26s_linear_infinite]">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-white border border-[#E0E0E0] shadow-[0_12px_28px_rgba(24,55,40,.10)] flex items-center justify-center text-[#3E5C54]">
                  <Factory className="w-6 h-6" />
                </div>

                <div className="absolute bottom-9 left-10 w-14 h-14 rounded-2xl bg-white border border-[#E0E0E0] shadow-[0_12px_28px_rgba(24,55,40,.10)] flex items-center justify-center text-[#C9A66B]">
                  <HardHat className="w-6 h-6" />
                </div>

                <div className="absolute bottom-10 right-9 w-14 h-14 rounded-2xl bg-white border border-[#E0E0E0] shadow-[0_12px_28px_rgba(24,55,40,.10)] flex items-center justify-center text-[#8a79b7]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* counter-rotating inner tiles */}
              <div className="absolute inset-[54px] animate-[spin_18s_linear_infinite_reverse]">
                <div className="absolute top-4 right-2 w-10 h-10 rounded-xl bg-[#F3E7D6] border border-white shadow-sm flex items-center justify-center text-[#C9A66B]">
                  <CircleCheck className="w-5 h-5" />
                </div>

                <div className="absolute bottom-8 left-2 w-10 h-10 rounded-xl bg-[#EEF2F0] border border-white shadow-sm flex items-center justify-center text-[#3E5C54]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* central card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] rounded-[30px] bg-white border border-white shadow-[0_24px_60px_rgba(24,55,40,.14)] p-5 rotate-[-3deg]">
                <div className="h-[210px] rounded-[22px] bg-[#F4F4F4] border border-dashed border-[#D6E2DD] relative overflow-hidden">

                  <div className="absolute -top-14 -right-14 w-32 h-32 rounded-full bg-[#E1ECE8]" />
                  <div className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-[#F3E7D6]" />

                  {/* factory illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-24">
                      <div className="absolute bottom-2 left-2 w-28 h-16 rounded-lg bg-[#DCE8E2] border border-[#C9D8D2]" />
                      <div className="absolute bottom-18 left-5 w-12 h-12 bg-[#3E5C54] rounded-t-lg" />
                      <div className="absolute bottom-18 left-19 w-8 h-16 bg-[#B9C9C3] rounded-t-lg" />
                      <div className="absolute bottom-2 left-8 w-6 h-8 bg-white rounded-t-md" />
                      <div className="absolute bottom-11 left-18 w-5 h-5 bg-white rounded-sm" />
                      <div className="absolute bottom-11 left-27 w-5 h-5 bg-white rounded-sm" />
                      <div className="absolute bottom-18 left-27 w-5 h-2 bg-[#C9A66B] rounded-full" />
                    </div>
                  </div>

                  <div className="absolute left-4 bottom-4 text-[9px] uppercase tracking-[.18em] font-bold text-[#C9A66B]">
                    Industrial safety
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xl font-semibold text-[#1E1E1E]">
                    One account. Every responsibility.
                  </div>
                  <p className="text-xs text-[#6C757D] mt-1.5 leading-5">
                    Your role controls the workspace and the information you can manage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* bottom workflow note */}
          <div className="relative z-20 px-7 pb-7">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/90 border border-white shadow-[0_12px_30px_rgba(24,55,40,.08)] px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF2F0] text-[#3E5C54] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1E1E1E]">
                  Role-aware registration
                </div>
                <div className="text-[10px] text-[#6C757D] mt-0.5">
                  Fields adapt to your selected responsibility
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT FORM ================= */}
        <main className="auth-panel flex flex-col">
          <div className="w-full max-w-[620px] mx-auto px-6 py-6 sm:px-8 lg:px-10">

            {/* TOP NAV */}
            <div className="flex items-center justify-between mb-5">
              <Link
                to="/"
                className="text-xs font-semibold text-[#6C757D] hover:text-[#3E5C54] transition-colors"
              >
                ← Back to home
              </Link>

              <div className="text-xs text-[#6C757D]">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#3E5C54] hover:text-[#3E5C54]-dark transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-4">
              <div className="midc-section-label">
                <span className="midc-dot bg-[#C9A66B]" />
                New safety profile
              </div>

              <h1 className="mt-2 text-[38px] sm:text-[44px] leading-[.98] font-semibold tracking-[-0.045em] text-[#1E1E1E]">
                Build your
                <br />
                <span className="text-[#C9A66B]">
                  safety workspace.
                </span>
              </h1>

              <p className="text-sm text-[#6C757D] mt-2 max-w-[540px] leading-5">
                Select your responsibility and enter the details used by your existing registration workflow.
              </p>
            </div>

            {/* ROLE SELECTION */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-semibold text-[#1E1E1E]">
                  Choose responsibility
                </label>
                <span className="text-[10px] text-[#6C757D]">
                  Fields adapt automatically
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = formData.role === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectRole(opt.value)}
                      className={`auth-role-card ${selected ? 'selected' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                          selected
                            ? 'bg-[#3E5C54] text-white'
                            : 'bg-[#3E5C54]-soft text-[#3E5C54]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="text-[11px] font-semibold text-[#1E1E1E] leading-tight">
                        {opt.role}
                      </div>

                      <div className="text-[8px] text-[#6C757D] mt-1 uppercase tracking-wider">
                        {opt.badge.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REGISTRATION FORM */}
            <form onSubmit={handleSubmit} className="space-y-2.5">

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label={labels.name}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  icon={User}
                />

                <Input
                  label={labels.email}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@organization.com"
                  required
                  icon={Mail}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  icon={Lock}
                />

                <Input
                  label="Phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  icon={Phone}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label={labels.org}
                  name="factoryName"
                  value={formData.factoryName}
                  onChange={handleChange}
                  placeholder="Organization / factory name"
                  icon={Building}
                />

                <Input
                  label={labels.id}
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Employee / officer ID"
                  icon={BadgeCheck}
                />
              </div>

              {/* SUBMIT */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#6C757D]">
                  <Shield className="w-4 h-4 text-[#3E5C54]" />
                  <span>Selected:</span>
                  <span className="font-semibold text-[#3E5C54]">
                    {selectedRoleOption.role}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-h-[48px] px-6 rounded-2xl bg-[#3E5C54]-dark text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#3E5C54] hover:-translate-y-px transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create workspace
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );

};

export default Register;