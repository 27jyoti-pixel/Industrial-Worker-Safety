import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Shield,
  Lock,
  Mail,
  HardHat,
  Building2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  TriangleAlert,
  ChevronRight
} from 'lucide-react';
import Input from '../components/common/Input';

const ROLE_PRESETS = [
  {
    id: "worker",
    role: "Industrial Worker",
    email: "worker@industrial.com",
    badge: "WORKER PORTAL",
    capabilities: "Report incidents, track compensation, access safety services",
    icon: HardHat
  },
  {
    id: "admin",
    role: "Factory Administrator",
    email: "admin@factory.com",
    badge: "PLANT OPERATIONS",
    capabilities: "Manage workers, verify incidents, monitor plant safety",
    icon: Building2
  },
  {
    id: "officer",
    role: "Government Safety Officer",
    email: "officer@gov.in",
    badge: "GOVT AUDIT PORTAL",
    capabilities: "Audit compliance, review incidents, approve claims",
    icon: Shield
  },
  {
    id: "superadmin",
    role: "Super Administrator",
    email: "superadmin@system.com",
    badge: "SYSTEM GOVERNANCE",
    capabilities: "Manage platform, control access, view analytics",
    icon: Cpu
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
    if (token) navigate('/dashboard');

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('expired') === 'true') {
      showWarning('Your session has expired. Please authenticate again.');
    }
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
    <div className="min-h-screen bg-[#F4F4F4] px-3 py-3 sm:px-5 sm:py-5 lg:px-7 flex items-center justify-center">
      <style>{`
        @keyframes midcFloatOne {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-4deg); }
          50% { transform: translate3d(7px, -9px, 0) rotate(3deg); }
        }
        @keyframes midcFloatTwo {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(5deg); }
          50% { transform: translate3d(-8px, 8px, 0) rotate(-3deg); }
        }
        @keyframes midcFloatThree {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(5px, 7px, 0) rotate(6deg); }
        }
        @keyframes midcDrift {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
        @keyframes midcPulse {
          0%, 100% { opacity: .45; transform: scale(.96); }
          50% { opacity: .8; transform: scale(1.04); }
        }
        .midc-float-one { animation: midcFloatOne 5.5s ease-in-out infinite; }
        .midc-float-two { animation: midcFloatTwo 6.2s ease-in-out infinite; }
        .midc-float-three { animation: midcFloatThree 5.8s ease-in-out infinite; }
        .midc-drift { animation: midcDrift 4.5s ease-in-out infinite; }
        .midc-pulse { animation: midcPulse 3.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .midc-float-one, .midc-float-two, .midc-float-three,
          .midc-drift, .midc-pulse { animation: none !important; }
        }
      `}</style>

      <div className="w-full max-w-[1280px] overflow-hidden rounded-[28px] border border-[#E0E0E0] bg-[#FFFFFF] shadow-[0_24px_70px_rgba(30,30,30,.10)]">
        <div className="grid lg:grid-cols-[0.88fr_1.12fr] min-h-[720px]">

          {/* Sign-in panel */}
          <section className="relative order-2 lg:order-1 bg-[#FFFFFF] px-6 py-7 sm:px-9 sm:py-9 lg:px-10 lg:py-10">
            <div className="mx-auto flex h-full w-full max-w-[510px] flex-col">

              <div className="flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2.5 group">
                  <div className="h-10 w-10 rounded-[13px] bg-[#EEF2F0] border border-[#D6E2DD] text-[#3E5C54] flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold tracking-tight text-[#1E1E1E]">MIDC Safety</div>
                    <div className="text-[10px] text-[#6C757D] mt-0.5">Industrial worker protection</div>
                  </div>
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[.15em] font-semibold text-[#6C757D]">
                  <Lock className="h-3.5 w-3.5" />
                  Secure access
                </div>
              </div>

              <div className="mt-10 sm:mt-12">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] font-semibold text-[#6C757D]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B]" />
                  Welcome back
                </div>

                <h1 className="mt-3 text-[34px] sm:text-[40px] leading-[1.04] font-semibold tracking-[-0.04em] text-[#1E1E1E]">
                  Sign in to your
                  <span className="block text-[#C9A66B]">safety workspace.</span>
                </h1>

                <p className="mt-4 max-w-[440px] text-sm leading-6 text-[#6C757D]">
                  Choose your access role and continue with your registered credentials.
                </p>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1E1E1E]">Choose workspace</label>
                  <span className="text-[10px] text-[#6C757D]">Access follows your role</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ROLE_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const selected = selectedRole.id === preset.id;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectRole(preset)}
                        className={`group w-full rounded-[16px] border px-3.5 py-3 text-left transition-all duration-200 ${
                          selected
                            ? 'border-[#79a48c] bg-[#EEF2F0] shadow-[0_7px_18px_rgba(62,92,84,.08)]'
                            : 'border-[#E0E0E0] bg-white hover:border-[#bccdc1] hover:-translate-y-px hover:shadow-[0_7px_18px_rgba(30,30,30,.05)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${
                            selected ? 'bg-[#3E5C54] text-white' : 'bg-[#EEF2F0] text-[#3E5C54]'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-[12px] font-semibold text-[#1E1E1E]">
                                {preset.role}
                              </span>
                              {selected && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A9D8F]" />}
                            </div>
                            <p className="mt-1 truncate text-[9px] text-[#6C757D]">
                              {preset.capabilities}
                            </p>
                          </div>

                          <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${
                            selected ? 'text-[#3E5C54]' : 'text-[#c1c4bf]'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Email / organization ID"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  required
                  icon={Mail}
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  icon={Lock}
                />

                <div className="flex items-center justify-between rounded-[14px] border border-[#E0E0E0] bg-[#F4F4F4] px-4 py-2.5">
                  <div className="min-w-0">
                    <div className="text-[9px] uppercase tracking-[.12em] text-[#6C757D]">Current workspace</div>
                    <div className="mt-0.5 truncate text-xs font-semibold text-[#1E1E1E]">{selectedRole.role}</div>
                  </div>
                  <span className="ml-3 shrink-0 flex items-center gap-1.5 text-[10px] font-medium text-[#2A9D8F]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2A9D8F]" />
                    Selected
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full min-h-[52px] rounded-[15px] bg-[#3E5C54] px-5 text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-[0_12px_25px_rgba(62,92,84,.16)] transition-all duration-200 hover:bg-[#2F4A43] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Signing in...'
                  ) : (
                    <>
                      Sign in to workspace
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-auto pt-7 border-t border-[#E0E0E0] mt-8 text-center text-sm text-[#6C757D]">
                New to MIDC?{' '}
                <Link to="/register" className="font-semibold text-[#3E5C54] hover:text-[#3E5C54] transition">
                  Create your safety profile
                </Link>
              </div>
            </div>
          </section>

          {/* Animated industrial visual panel */}
          <section className="relative order-1 lg:order-2 min-h-[390px] lg:min-h-full overflow-hidden bg-[#EEF2F0]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#F4F4F4_0%,#E9EFEC_52%,#E0E0E0_100%)]" />

            {/* subtle industrial grid */}
            <div className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(62,92,84,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(62,92,84,.08) 1px, transparent 1px)',
                backgroundSize: '92px 92px'
              }}
            />

            {/* soft background shapes */}
            <div className="absolute -left-24 -top-28 h-[330px] w-[330px] rounded-full bg-[#E1ECE8] opacity-80" />
            <div className="absolute -right-24 -bottom-28 h-[350px] w-[350px] rounded-full bg-[#F3E7D6] opacity-70" />
            <div className="absolute right-[16%] top-[9%] h-28 w-28 rounded-full border-[24px] border-[#C9D8D2]/70 midc-pulse" />

            <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10">

              {/* top brand / label */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[.22em] font-semibold text-[#6C757D]">INDUSTRIAL SAFETY NETWORK</div>
                  <h2 className="mt-3 max-w-[430px] text-[30px] sm:text-[38px] lg:text-[44px] leading-[1.02] font-semibold tracking-[-0.04em] text-[#1E1E1E]">
                    A safer place
                    <span className="block text-[#C9A66B]">starts with you.</span>
                  </h2>
                  <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#6C757D]">
                    Worker records, incident response and workplace protection in one connected system.
                  </p>
                </div>

                <div className="hidden sm:flex h-11 w-11 rounded-[14px] bg-[#FFFFFF]/85 border border-white/80 shadow-sm items-center justify-center text-[#3E5C54]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              {/* Main rotating industrial composition */}
              <div className="absolute left-5 right-5 bottom-6 top-[230px] sm:left-8 sm:right-8 sm:bottom-8 lg:left-10 lg:right-10 lg:bottom-10 lg:top-[245px]">

                {/* central framed "safety board" */}
                <div className="absolute left-[8%] top-[8%] w-[56%] h-[68%] rounded-[25px] border-[10px] border-[#FFFFFF] bg-[#f7f5ef] shadow-[0_22px_45px_rgba(30,30,30,.10)] rotate-[-3deg] midc-drift">
                  <div className="absolute inset-3 rounded-[17px] border border-dashed border-[#D6E2DD] overflow-hidden bg-[#F4F4F4]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.9),transparent_34%),linear-gradient(135deg,#F4F4F4,#E9EFEC)]" />

                    <div className="absolute left-[12%] top-[12%] h-12 w-12 rounded-full bg-[#E1ECE8] border border-white shadow-sm" />
                    <div className="absolute right-[11%] top-[22%] h-16 w-16 rounded-[22px] bg-[#F3E7D6] border border-white shadow-sm rotate-12" />

                    {/* safety location marker */}
                    <div className="absolute left-1/2 top-[42%] -translate-x-1/2">
                      <div className="h-16 w-16 rounded-[20px] bg-[#3E5C54] text-white flex items-center justify-center rotate-45 shadow-[0_14px_28px_rgba(62,92,84,.20)]">
                        <ShieldCheck className="h-7 w-7 -rotate-45" />
                      </div>
                    </div>

                    <div className="absolute left-[10%] bottom-[10%]">
                      <div className="text-[9px] uppercase tracking-[.2em] font-semibold text-[#3E5C54]">SAFETY NETWORK</div>
                      <div className="mt-2 text-[22px] sm:text-[25px] font-semibold tracking-[-.025em] text-[#1E1E1E]">
                        Protect. Respond.
                      </div>
                      <div className="mt-1 text-xs text-[#6C757D]">Every shift. Every worker.</div>
                    </div>
                  </div>
                </div>

                {/* rotating industrial tile: worker */}
                <div className="absolute right-[3%] top-[1%] w-[28%] min-w-[125px] aspect-[1.12] rounded-[21px] bg-[#3E5C54] text-white shadow-[0_18px_35px_rgba(62,92,84,.16)] midc-float-one overflow-hidden">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border-[18px] border-white/10" />
                  <div className="p-4">
                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <HardHat className="h-4.5 w-4.5" />
                    </div>
                    <div className="mt-5 text-[12px] font-semibold">Worker safety</div>
                    <div className="mt-1 text-[9px] text-white/55">Protected access</div>
                  </div>
                </div>

                {/* rotating industrial tile: factory */}
                <div className="absolute right-[1%] bottom-[3%] w-[30%] min-w-[135px] aspect-[1.05] rounded-[21px] bg-[#FFFFFF] border border-white shadow-[0_18px_35px_rgba(30,30,30,.08)] midc-float-two overflow-hidden">
                  <div className="absolute -right-7 -bottom-7 h-24 w-24 rounded-full bg-[#F3E7D6]/70" />
                  <div className="p-4">
                    <div className="h-9 w-9 rounded-xl bg-[#EEF2F0] text-[#3E5C54] flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="mt-5 text-[12px] font-semibold text-[#1E1E1E]">Factory network</div>
                    <div className="mt-1 text-[9px] text-[#6C757D]">Connected operations</div>
                  </div>
                </div>

                {/* small rotating incident tile */}
                <div className="absolute left-[1%] bottom-[4%] w-[24%] min-w-[112px] aspect-[1.05] rounded-[19px] bg-[#F3E7D6] border border-white/70 shadow-[0_16px_30px_rgba(30,30,30,.08)] midc-float-three">
                  <div className="p-4">
                    <div className="h-8 w-8 rounded-xl bg-white/55 text-[#E63946] flex items-center justify-center">
                      <TriangleAlert className="h-4 w-4" />
                    </div>
                    <div className="mt-4 text-[11px] font-semibold text-[#8B5E54]">Incident response</div>
                  </div>
                </div>

                {/* tiny floating status */}
                <div className="absolute left-[38%] bottom-[0%] rounded-full border border-white/80 bg-[#FFFFFF]/85 px-3 py-2 shadow-sm backdrop-blur-sm midc-drift">
                  <div className="flex items-center gap-2 text-[9px] font-semibold text-[#6C757D]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2A9D8F]" />
                    Connected safety workflow
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-6 sm:left-8 lg:left-10 flex items-center gap-2 text-[9px] uppercase tracking-[.16em] font-semibold text-[#6C757D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B]" />
                Secure industrial workspace
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;