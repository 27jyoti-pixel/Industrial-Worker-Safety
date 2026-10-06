import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, HardHat, Building2, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../components/common/Input';

const ROLE_PRESETS = [
  { id: 'worker', role: 'Industrial Worker', email: 'worker@industrial.com', badge: 'WORKER PORTAL', capabilities: 'Report incidents, track compensation, access safety services', icon: HardHat },
  { id: 'admin', role: 'Factory Administrator', email: 'admin@factory.com', badge: 'PLANT OPERATIONS', capabilities: 'Manage workers, verify incidents, monitor plant safety', icon: Building2 },
  { id: 'officer', role: 'Government Safety Officer', email: 'officer@gov.in', badge: 'GOVT AUDIT PORTAL', capabilities: 'Audit compliance, review incidents, approve claims', icon: Shield },
  { id: 'superadmin', role: 'Super Administrator', email: 'superadmin@system.com', badge: 'SYSTEM GOVERNANCE', capabilities: 'Manage platform, control access, view analytics', icon: Cpu }
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
    if (token) navigate('/dashboard');
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') showWarning('Your session has expired. Please authenticate again.');
  }, [token, navigate, location, showWarning]);

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
      <main className="midc-auth-shell mx-auto w-full max-w-[720px] px-6 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="mb-8 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#666]"><Lock className="h-4 w-4 text-[#E87532]" />Secure workspace access</div>
        <h1 className="max-w-[560px] text-[38px] font-semibold leading-[1.08] tracking-[-.045em] sm:text-[46px]">Sign in to your<br />safety workspace.</h1>
        <p className="mt-4 max-w-[540px] text-[15px] leading-7 text-[#666]">Access worker records, incident response, safety complaints and compensation workflows through your authorized workspace.</p>
        <section className="mt-9" aria-label="Choose workspace">
          <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold">Choose workspace</h2><span className="text-xs text-[#777]">Access follows your role</span></div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLE_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const selected = selectedRole.id === preset.id;
              return <button key={preset.id} type="button" onClick={() => handleSelectRole(preset)} aria-pressed={selected} className={`flex h-[78px] items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-[#dedede] bg-white hover:border-[#aaa]'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${selected ? 'bg-[#111] text-white' : 'bg-[#f4f4f4] text-[#444]'}`}><Icon className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-5 text-[#171717]">{preset.role}</span><span className="mt-1 block text-[10px] uppercase tracking-[.08em] text-[#777]">{preset.badge}</span></span>
                {selected && <span className="h-2 w-2 shrink-0 rounded-full bg-[#E87532]" />}
              </button>;
            })}
          </div>
        </section>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <Input label="Email / organization ID" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.com" required icon={Mail} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required icon={Lock} />
          <div className="flex items-center gap-2 border-l-2 border-[#E87532] py-1 pl-3 text-sm text-[#666]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#555]" /><span>Current workspace: <strong className="font-semibold text-[#222]">{selectedRole.role}</strong></span></div>
          <button type="submit" disabled={loading} className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-[#111] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Signing in...' : <>Sign in to workspace <ArrowRight className="h-4 w-4" /></>}</button>
        </form>
        <p className="mt-6 text-center text-sm text-[#666]">New to MIDC? <Link to="/register" className="font-semibold text-[#111] underline decoration-[#E87532] underline-offset-4">Create your safety profile</Link></p>
      </main>
    </div>
  );
};

export default Login;
