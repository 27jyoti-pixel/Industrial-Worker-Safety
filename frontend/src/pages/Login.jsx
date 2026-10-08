import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail, HardHat, Building2, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';
import Input from '../components/common/Input';
import loginHero from '../assets/login-industrial-background.png';

const ROLE_PRESETS = [
  { id: 'worker', accountRole: 'Worker', role: 'Industrial Worker', email: 'worker@industrial.com', badge: 'Worker Portal', capabilities: 'Report incidents, track compensation, access safety services', icon: HardHat },
  { id: 'admin', accountRole: 'Factory Admin', role: 'Factory Administrator', email: 'admin@factory.com', badge: 'Plant Operations', capabilities: 'Manage workers, verify incidents, monitor plant safety', icon: Building2 },
  { id: 'officer', accountRole: 'Government Officer', role: 'Government Safety Officer', email: 'officer@gov.in', badge: 'Govt Audit Portal', capabilities: 'Audit compliance, review incidents, approve claims', icon: Shield },
  { id: 'superadmin', accountRole: 'Super Admin', role: 'Super Administrator', email: 'superadmin@system.com', badge: 'System Governance', capabilities: 'Manage platform, control access, view analytics', icon: Cpu }
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
      const user = await login(email, password, selectedRole.accountRole);
      showSuccess(`Authenticated successfully: ${user.name} (${user.role})`);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="midc-auth-page relative isolate h-screen overflow-hidden bg-transparent text-[#111111]">
      <style>{`
        .midc-login-background { position:fixed; inset:0; z-index:0; background:url("${loginHero}") center center / cover no-repeat; }
        @supports (height: 100dvh) { .midc-auth-page { height:100dvh; } }
        .midc-auth-header { position:absolute; top:0; right:0; left:0; z-index:20; height:68px; background:transparent; border:0; box-shadow:none; backdrop-filter:none; }
        .midc-auth-header .midc-container { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; width:92%; max-width:none; height:78px; margin-inline:auto; }
        .midc-auth-header .midc-container > a:first-child { justify-self:start; align-items:center; gap:.75rem; color:#fff; }
        .midc-auth-header .midc-brand-mark { display:flex; flex:none; width:42px; height:42px; align-items:center; justify-content:center; border-radius:9px; background:#111 !important; color:#fff !important; box-shadow:none !important; animation:none !important; }
        .midc-auth-header .midc-brand-mark + div { line-height:1.25; }
        .midc-auth-header .midc-brand-mark + div > div:first-child { color:#fff; font-size:1.1875rem; font-weight:700; letter-spacing:-.035em; }
        .midc-auth-header .midc-brand-mark + div > div:last-child { margin-top:0; color:rgba(255,255,255,.78); font-size:.8125rem; font-weight:400; line-height:1.4; }
        .midc-auth-header .midc-auth-home { grid-column:3; justify-self:end; padding:.625rem 1rem; border-radius:9px; color:#fff; font-size:.9375rem; font-weight:500; }
        .midc-auth-header .midc-auth-home:hover { background:transparent; color:rgba(255,255,255,.82); }
        .midc-auth-shell { position:relative; z-index:1; display:grid; width:100vw; height:100vh; height:100dvh; grid-template-columns:1fr 1fr; grid-template-rows:68px minmax(0,1fr); overflow:hidden; }
        .midc-auth-shell > section:first-child { grid-column:1; grid-row:2; }
        .midc-auth-shell > section:last-child { grid-column:2; grid-row:2; }
        .midc-auth-intro { background:transparent; }
        .midc-login-panel { box-sizing:border-box; width:100%; padding:32px 28px 24px; border:1px solid rgba(255,255,255,.24); border-radius:20px; background:rgba(65,68,72,.56); color:#fff; box-shadow:0 18px 48px rgba(0,0,0,.18); -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px); }
        .midc-login-glass h2 { color:#fff; font-size:16px !important; font-weight:600 !important; line-height:1.25 !important; }
        .midc-login-glass .workspace-hint { color:rgba(255,255,255,.76); font-size:13px !important; font-weight:400 !important; line-height:1.4 !important; }
        .midc-login-glass button[aria-pressed="true"] { border-color:#E87532 !important; background:rgba(255,255,255,.15) !important; }
        .midc-login-glass button[aria-pressed="false"] { border-color:rgba(255,255,255,.23) !important; background:rgba(255,255,255,.08) !important; }
        .midc-login-glass button[aria-pressed] > span:first-child { background:rgba(255,255,255,.16) !important; color:#fff !important; }
        .midc-login-glass button[aria-pressed="true"] > span:first-child { background:rgba(0,0,0,.38) !important; }
        .midc-login-glass button[aria-pressed] .min-w-0 span:first-child { color:#fff !important; font-size:14px !important; font-weight:600 !important; line-height:1.2 !important; }
        .midc-login-glass button[aria-pressed] .min-w-0 span:last-child { color:rgba(255,255,255,.76) !important; font-size:11px !important; font-weight:400 !important; line-height:1.2 !important; letter-spacing:normal !important; text-transform:none !important; }
        .midc-login-glass label { margin-bottom:6px !important; color:#fff !important; font-size:13px !important; font-weight:600 !important; line-height:1.3 !important; }
        #root .midc-login-glass input { box-sizing:border-box; height:50px; min-height:50px; border:1px solid rgba(255,255,255,.25) !important; border-radius:10px !important; background:rgba(255,255,255,.1) !important; color:#fff !important; padding:0 14px 0 42px !important; font-size:13px !important; font-weight:400 !important; line-height:1.4 !important; box-shadow:none !important; }
        #root .midc-login-glass input::placeholder { color:rgba(255,255,255,.68) !important; font-size:13px !important; font-weight:400 !important; }
        #root .midc-login-glass input:focus { border-color:rgba(232,117,50,.85) !important; box-shadow:none !important; outline:none !important; }
        #root .midc-login-glass input:-webkit-autofill,
        #root .midc-login-glass input:-webkit-autofill:hover,
        #root .midc-login-glass input:-webkit-autofill:focus { -webkit-text-fill-color:#fff !important; -webkit-box-shadow:0 0 0 1000px rgba(255,255,255,.1) inset !important; transition:background-color 9999s ease-out 0s; }
        .midc-login-glass .relative > svg { width:18px !important; height:18px !important; color:rgba(255,255,255,.82) !important; }
        .midc-login-glass .current-workspace { color:rgba(255,255,255,.82) !important; font-size:13px !important; font-weight:400 !important; }
        .midc-login-glass .current-workspace strong { color:#fff !important; font-size:13px !important; font-weight:600 !important; }
        .midc-login-glass .create-profile { margin-top:10px !important; color:rgba(255,255,255,.86) !important; font-size:13px !important; font-weight:400 !important; }
        .midc-login-glass .create-profile a { color:#fff !important; font-size:13px !important; font-weight:600 !important; }
        .midc-login-glass button[aria-pressed] { height:70px !important; padding:10px 12px !important; }
        .midc-login-glass form { margin-top:14px; }
        .midc-login-glass form > :not([hidden]) ~ :not([hidden]) { margin-top:14px; }
        .midc-login-glass form > :nth-child(2) + .current-workspace { margin-top:12px; }
        .midc-login-glass form > .current-workspace + button[type="submit"] { margin-top:14px; }
        .midc-login-glass form button[type="submit"] { height:52px; min-height:52px; font-size:14px !important; font-weight:600 !important; line-height:1.4 !important; }
        @media (min-width: 1024px) {
          .midc-auth-page { height:100vh; height:100dvh; overflow:hidden; }
          .midc-auth-header { height:92px; }
          .midc-auth-header .midc-container { height:92px; }
          .midc-auth-header .midc-container > a:first-child { margin-left:-18px; }
          .midc-auth-shell { height:100vh; height:100dvh; grid-template-columns:58% 42%; grid-template-rows:92px minmax(0,1fr); }
          .midc-auth-intro { min-height:0; }
          .midc-login-panel { position:relative; left:-25px; width:min(690px,calc(36vw + 30px)); max-width:690px; height:min(640px,calc(100dvh - 140px)); max-height:640px; padding:32px 28px 24px; display:flex; flex-direction:column; justify-content:flex-start; }
          .midc-login-panel > * { width:100%; max-width:none; }
        }
        @media (max-width: 640px) { .midc-login-panel { padding:22px 28px; border-radius:16px; } }
        @media (max-width: 1023px) { .midc-auth-header .midc-container { height:68px; } .midc-auth-shell { grid-template-rows:68px minmax(0,1fr); } }
        @media (max-width: 767px) { .midc-auth-header .midc-container { grid-template-columns:1fr auto; } .midc-auth-spacer { display:none; } .midc-auth-header .midc-auth-home { grid-column:2; } }
        @media (max-width: 400px) { .midc-auth-header .midc-container > a:first-child { gap:.5rem; } .midc-auth-header .midc-brand-mark + div > div:last-child { font-size:.72rem; } .midc-auth-header .midc-auth-home { padding-inline:.4rem; font-size:.8125rem; } }
      `}</style>
      <div className="midc-login-background" role="img" aria-label="Industrial refinery at sunset" />
      <header className="midc-auth-header z-50">
        <div className="midc-container">
          <Link to="/" className="flex">
            <div className="midc-brand-mark"><ShieldCheck className="h-5 w-5" /></div>
            <div><div className="font-extrabold leading-tight">MIDC Safety</div><div className="text-[11px] text-[#6C757D]">Industrial worker protection</div></div>
          </Link>
          <div className="midc-auth-spacer" />
          <Link to="/" className="midc-auth-home inline-flex items-center gap-2">Back to home <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </header>
      <main className="midc-auth-shell grid h-screen w-screen grid-cols-2">
        <section className="midc-auth-intro relative flex min-h-0 items-center overflow-hidden px-7 py-12 text-white sm:px-12 lg:items-start lg:pl-[5.2%] lg:pr-[8.7%] lg:pb-12 lg:pt-[14vh]" aria-label="MIDC Safety introduction">
          <div className="relative z-10 w-full max-w-[640px]">
            <div className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.15em] text-white/85 sm:text-xs"><Lock className="h-4 w-4 text-[#E87532]" />Secure workspace access</div>
            <h1 className="max-w-[640px] text-[42px] font-semibold leading-[1.02] tracking-[-.04em] sm:text-[54px] xl:text-[62px]">Safer people.<br />Stronger workplaces.</h1>
            <p className="mt-5 max-w-[590px] text-[15px] leading-6 text-white/85 sm:text-[16px]">Sign in to access worker records, incident response, safety complaints and compensation workflows.</p>
            <div className="mt-7 h-[2px] w-12 bg-[#E87532]" aria-hidden="true" />
          </div>
        </section>
        <section className="flex items-center justify-center bg-transparent px-6 py-10 sm:px-10 lg:items-start lg:justify-start lg:px-0 lg:py-0 lg:pl-8 lg:pr-[4%] lg:pt-6" aria-label="Sign in to your workspace">
          <div className="midc-login-panel midc-login-glass w-full">
            <section aria-label="Choose workspace">
              <div className="mb-3.5 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold sm:text-base">Choose workspace</h2><span className="workspace-hint text-xs sm:text-sm">Access follows your role</span></div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ROLE_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const selected = selectedRole.id === preset.id;
                  return <button key={preset.id} type="button" onClick={() => handleSelectRole(preset)} aria-pressed={selected} className={`flex h-[70px] items-center gap-[10px] rounded-lg border px-2.5 py-2.5 text-left transition-colors ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-[#dedede] bg-white hover:border-[#aaa]'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${selected ? 'bg-[#111] text-white' : 'bg-[#f3f3f3] text-[#333]'}`}><Icon className="h-[18px] w-[18px]" /></span>
                    <span className="min-w-0 flex-1"><span className="block whitespace-nowrap text-[14px] font-semibold leading-5 text-[#171717]">{preset.role}</span><span className="mt-0.5 block text-[11px] text-[#687386]">{preset.badge}</span></span>
                    <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87532] ${selected ? 'opacity-100' : 'opacity-0'}`} />
                  </button>;
                })}
              </div>
            </section>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <Input label="Email / organization ID" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organization.com" required icon={Mail} />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required icon={Lock} />
              <div className="current-workspace flex items-center gap-2 border-l-2 border-[#E87532] py-1 pl-3 text-xs sm:text-sm"><ShieldCheck className="h-4 w-4 shrink-0" /><span>Current workspace: <strong className="font-semibold">{selectedRole.role}</strong></span></div>
              <button type="submit" disabled={loading} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#111] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Signing in...' : <>Sign in to workspace <ArrowRight className="h-4 w-4" /></>}</button>
            </form>
            <p className="create-profile mt-4 text-center text-sm">New to MIDC? <Link to="/register" className="font-semibold underline decoration-[#E87532] underline-offset-4">Create your safety profile</Link></p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
