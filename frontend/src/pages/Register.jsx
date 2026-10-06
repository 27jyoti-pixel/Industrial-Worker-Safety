import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import { Shield, ShieldCheck, User, Mail, Lock, Phone, Building, BadgeCheck, HardHat, Building2, Cpu, ArrowRight, Check } from 'lucide-react';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import { AVATAR_GROUPS } from '../components/profile/profileAvatarOptions';

const ROLE_OPTIONS = [
  { value: 'Worker', role: 'Industrial Worker', badge: 'WORKER PORTAL', icon: HardHat },
  { value: 'Factory Admin', role: 'Factory Administrator', badge: 'PLANT OPERATIONS', icon: Building2 },
  { value: 'Government Officer', role: 'Government Safety Officer', badge: 'GOVT AUDIT PORTAL', icon: Shield },
  { value: 'Super Admin', role: 'Super Administrator', badge: 'SYSTEM GOVERNANCE', icon: Cpu }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Worker',
    factoryName: '',
    employeeId: '',
    avatarId: null
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.value === formData.role) || ROLE_OPTIONS[0];

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

  const getFieldLabels = () => {
    switch (formData.role) {
      case 'Factory Admin':
        return { name: 'Administrator Name', email: 'Official Email Address', org: 'Organization / Factory Name', id: 'Admin ID / Code' };
      case 'Government Officer':
        return { name: 'Officer Name', email: 'Government Email Address', org: 'Department / Agency Name', id: 'Officer Badge / ID' };
      case 'Super Admin':
        return { name: 'System Admin Name', email: 'System Admin Email', org: 'System Unit / Zone', id: 'Admin Access Key' };
      default:
        return { name: 'Full Worker Name', email: 'Personal / Work Email', org: 'Factory Name', id: 'Employee ID' };
    }
  };

  const labels = getFieldLabels();

  return (
    <div className="midc-auth-page min-h-screen bg-white text-[#111111]">
      <style>{`
        .midc-auth-header { background:#fff; border-bottom:1px solid #e5e5e5; }
        .midc-auth-header .midc-container { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; width:min(92vw,1420px); height:78px; margin-inline:auto; }
        .midc-auth-header .midc-container > a:first-child { justify-self:start; align-items:center; gap:.75rem; color:#111; }
        .midc-auth-header .midc-brand-mark { display:flex; flex:none; width:47px; height:50px; align-items:center; justify-content:center; border-radius:10px; background:#111 !important; color:#fff !important; box-shadow:none !important; animation:none !important; }
        .midc-auth-header .midc-brand-mark + div { line-height:1.25; }
        .midc-auth-header .midc-brand-mark + div > div:first-child { font-size:1.1875rem; font-weight:700; letter-spacing:-.035em; }
        .midc-auth-header .midc-brand-mark + div > div:last-child { margin-top:0; font-size:.8125rem; font-weight:400; line-height:1.4; }
        .midc-auth-header .midc-auth-home { grid-column:3; justify-self:end; padding:.625rem 1rem; border-radius:9px; color:#171717; font-size:.9375rem; font-weight:500; }
        .midc-auth-header .midc-auth-home:hover { background:#f4f4f4; }
        .midc-auth-page input { min-height: 48px; border: 1px solid #dedede !important; border-radius: 8px !important; background: #fff !important; color: #111 !important; padding: 12px 14px 12px 42px !important; box-shadow: none !important; }
        .midc-auth-page input::placeholder { color: #8a8a8a !important; }
        .midc-auth-page input:focus { border-color: #E87532 !important; box-shadow: 0 0 0 3px rgba(232,117,50,.12) !important; }
        .midc-auth-page label { color: #252525 !important; font-weight: 500 !important; }
        @media (max-width: 767px) { .midc-auth-header .midc-container { grid-template-columns:1fr auto; height:68px; } .midc-auth-spacer { display:none; } .midc-auth-header .midc-auth-home { grid-column:2; } }
        @media (max-width: 400px) { .midc-auth-header .midc-container > a:first-child { gap:.5rem; } .midc-auth-header .midc-brand-mark + div > div:last-child { font-size:.72rem; } .midc-auth-header .midc-auth-home { padding-inline:.4rem; font-size:.8125rem; } }
        @media (max-width: 640px) { .midc-auth-shell { padding-left: 20px; padding-right: 20px; } }
      `}</style>
      <header className="midc-auth-header sticky top-0 z-50">
        <div className="midc-container">
          <Link to="/" className="flex">
            <div className="midc-brand-mark"><ShieldCheck className="h-5 w-5" /></div>
            <div><div className="font-extrabold leading-tight">MIDC Safety</div><div className="text-[11px] text-[#6C757D]">Industrial worker protection</div></div>
          </Link>
          <div className="midc-auth-spacer" />
          <Link to="/" className="midc-auth-home">Back to home</Link>
        </div>
      </header>
      <main className="midc-auth-shell mx-auto w-full max-w-[1080px] px-6 pb-16 pt-10 sm:px-8 sm:pt-12">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#666]"><span className="h-2 w-2 rounded-full bg-[#E87532]" />Create your safety workspace</div>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-.045em] sm:text-[46px]">Build your safety workspace.</h1><p className="mt-3 max-w-[670px] text-[15px] leading-7 text-[#666]">Select your responsibility and enter the details used by your existing registration workflow.</p></div>
          <p className="shrink-0 pb-1 text-sm text-[#666]">Already registered? <Link to="/login" className="font-semibold text-[#111] underline decoration-[#E87532] underline-offset-4">Sign in</Link></p>
        </div>
        <section className="mt-8" aria-label="Choose responsibility">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Choose responsibility</h2><span className="text-xs text-[#777]">Fields adapt automatically</span></div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const selected = formData.role === opt.value;
              return <button key={opt.value} type="button" onClick={() => handleSelectRole(opt.value)} aria-pressed={selected} className={`relative flex min-h-[82px] items-center gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-[#dedede] bg-white hover:border-[#aaa]'}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${selected ? 'bg-[#111] text-white' : 'bg-[#f4f4f4] text-[#444]'}`}><Icon className="h-4 w-4" /></span>
                <span className="min-w-0"><span className="block text-xs font-semibold leading-4 text-[#171717]">{opt.role}</span><span className="mt-1 block text-[10px] uppercase tracking-[.08em] text-[#777]">{opt.badge.split(' ')[0]}</span></span>
                {selected && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E87532]" />}
              </button>;
            })}
          </div>
        </section>
        <section className="mt-6" aria-labelledby="profile-avatar-choice-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <div>
              <h2 id="profile-avatar-choice-title" className="text-sm font-semibold">Choose your profile avatar <span className="font-normal text-[#777]">(optional)</span></h2>
              <p className="mt-1 text-xs text-[#777]">Personalize your profile. You can change this later.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, avatarId: null })}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${formData.avatarId === null ? 'text-[#111]' : 'text-[#666] hover:bg-[#f5f5f5] hover:text-[#222]'}`}
              aria-pressed={formData.avatarId === null}
            >
              Use initials instead
            </button>
          </div>
          <div className="max-h-[440px] overflow-y-auto pr-1">
            <div className="grid gap-4 md:grid-cols-2">
              {AVATAR_GROUPS.map((group) => (
                <section key={group.id} aria-label={group.label} className="min-w-0 rounded-lg border border-[#e8e8e8] p-2.5">
                  <h3 className="mb-2 text-xs font-semibold text-[#333]">{group.label}</h3>
                  <div className="grid grid-cols-4 gap-1.5">
                    {group.avatars.map((avatar) => {
                      const selected = formData.avatarId === avatar.id;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatarId: avatar.id })}
                          aria-label={avatar.label}
                          aria-pressed={selected}
                          className={`relative flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-1.5 transition-colors ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-transparent bg-white hover:border-[#dedede] hover:bg-[#fafafa]'}`}
                        >
                          <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-1 ring-[#e1e1e1] sm:h-11 sm:w-11">
                            <ProfileAvatar avatarId={avatar.id} />
                            {selected && <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#E87532] text-white"><Check className="h-3 w-3" /></span>}
                          </span>
                          <span className="w-full truncate text-center text-[10px] leading-3 text-[#595959]">{avatar.displayLabel}</span>
                          <span className="text-[9px] capitalize leading-3 text-[#888]">{avatar.gender}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-4 flex items-center gap-3"><h2 className="text-xs font-semibold uppercase tracking-[.14em] text-[#555]">Account and organization details</h2><span className="h-px flex-1 bg-[#e8e8e8]" /></div>
          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Input label={labels.name} name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required icon={User} />
            <Input label={labels.email} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@organization.com" required icon={Mail} />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required icon={Lock} />
            <Input label="Phone number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" icon={Phone} />
            <Input label={labels.org} name="factoryName" value={formData.factoryName} onChange={handleChange} placeholder="Organization / factory name" icon={Building} />
            <Input label={labels.id} name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee / officer ID" icon={BadgeCheck} />
          </div>
          <div className="mt-6 flex flex-col gap-4 border-t border-[#e8e8e8] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[#666]"><Shield className="h-4 w-4 text-[#E87532]" /><span>Selected: <strong className="font-semibold text-[#222]">{selectedRoleOption.role}</strong></span></div>
            <button type="submit" disabled={loading} className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-[#111] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{loading ? 'Creating account...' : <>Create workspace <ArrowRight className="h-4 w-4" /></>}</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
