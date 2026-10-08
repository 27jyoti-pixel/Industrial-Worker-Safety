import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import { Shield, ShieldCheck, User, Mail, Lock, Phone, Building, BadgeCheck, HardHat, Building2, Cpu, ArrowRight, ArrowLeft, Check, ChevronDown, CalendarDays, MapPin, Droplet, Users } from 'lucide-react';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import { AVATAR_GROUPS, PROFILE_AVATARS } from '../components/profile/profileAvatarOptions';
import { validateRegistration } from '../utils/registrationValidation';

const ROLE_OPTIONS = [
  { value: 'Worker', role: 'Industrial Worker', badge: 'WORKER PORTAL', icon: HardHat, avatarId: 'field-worker-male', points: ['Report incidents', 'Raise concerns', 'Track compensation'] },
  { value: 'Factory Admin', role: 'Factory Administrator', badge: 'PLANT OPERATIONS', icon: Building2, avatarId: 'manager-male', points: ['Manage workers', 'Oversee safety', 'Handle reports'] },
  { value: 'Government Officer', role: 'Government Safety Officer', badge: 'GOVT AUDIT PORTAL', icon: Shield, avatarId: 'safety-inspector-female', points: ['Audit and monitor', 'Ensure compliance', 'View reports'] },
  { value: 'Super Admin', role: 'Super Administrator', badge: 'SYSTEM GOVERNANCE', icon: Cpu, avatarId: 'office-staff-male', points: ['System management', 'User administration', 'Platform governance'] }
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    alternatePhone: '',
    bloodGroup: '',
    dateOfBirth: '',
    residentialAddress: '',
    city: '',
    state: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: '',
    role: 'Worker',
    factoryName: '',
    employeeId: '',
    department: '',
    designation: '',
    shift: '',
    joiningDate: '',
    workLocation: '',
    supervisor: '',
    employmentType: '',
    employeeStatus: '',
    avatarId: null
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarBrowserOpen, setAvatarBrowserOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const selectedRoleOption = ROLE_OPTIONS.find((r) => r.value === formData.role) || ROLE_OPTIONS[0];
  const selectedAvatar = PROFILE_AVATARS.find((avatar) => avatar.id === formData.avatarId);
  const avatarPreview = selectedAvatar;
  const steps = ['Role', 'Avatar', 'Personal', 'Work', 'Review'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectRole = (roleValue) => {
    setFormData({ ...formData, role: roleValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      if (currentStep === 2) {
        const validationMessage = validateRegistration(formData);
        if (validationMessage) {
          showError(validationMessage);
          return;
        }
      }
      setCurrentStep((step) => step + 1);
      setAvatarBrowserOpen(false);
      return;
    }
    const validationMessage = validateRegistration(formData);
    if (validationMessage) {
      showError(validationMessage);
      return;
    }
    setLoading(true);
    try {
      await register({ ...formData, name: formData.name.trim(), email: formData.email.trim() });
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
  const personalReviewGroups = [
    { title: 'Personal & contact information', fields: [
      { label: 'Full Name', value: formData.name },
      { label: 'Email Address', value: formData.email },
      { label: 'Phone Number', value: formData.phone },
      { label: 'Alternate Phone Number', value: formData.alternatePhone },
      { label: 'Blood Group', value: formData.bloodGroup },
      { label: 'Date of Birth', value: formData.dateOfBirth }
    ] },
    { title: 'Address', fields: [
      { label: 'Residential Address', value: formData.residentialAddress },
      { label: 'City', value: formData.city },
      { label: 'State', value: formData.state }
    ] },
    { title: 'Emergency Contact', fields: [
      { label: 'Name', value: formData.emergencyContactName },
      { label: 'Relationship', value: formData.emergencyContactRelationship },
      { label: 'Phone Number', value: formData.emergencyContactNumber }
    ] }
  ];
  const workReviewGroups = [
    { title: 'Employment details', fields: [
      { label: 'Role', value: selectedRoleOption.role },
      { label: labels.id, value: formData.employeeId },
      { label: 'Department', value: formData.department },
      { label: 'Designation / Job Title', value: formData.designation },
      { label: 'Shift', value: formData.shift },
      { label: 'Joining Date', value: formData.joiningDate }
    ] },
    { title: 'Factory / work details', fields: [
      { label: 'Factory Unit / Company', value: formData.factoryName },
      { label: 'Work Location', value: formData.workLocation },
      { label: 'Supervisor / Reporting Manager', value: formData.supervisor },
      { label: 'Employment Type', value: formData.employmentType },
      { label: 'Employee Status', value: formData.employeeStatus }
    ] }
  ];

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
        .midc-auth-page input:focus { border-color: #F2C7B0 !important; box-shadow: none !important; outline: none !important; }
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
      <main className="midc-auth-shell mx-auto w-full max-w-[1500px] px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-[#666]"><span className="h-2 w-2 rounded-full bg-[#E87532]" />Create your safety workspace</div>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-.04em] sm:text-[42px]">Build your safety workspace</h1><p className="mt-2 max-w-[700px] text-[15px] leading-6 text-[#666]">A few guided steps to create your safety identity.</p></div>
          <p className="shrink-0 pb-1 text-sm text-[#666]">Already registered? <Link to="/login" className="font-semibold text-[#111] underline decoration-[#E87532] underline-offset-4">Sign in</Link></p>
        </div>

        <nav className="mt-7 overflow-x-auto border-y border-[#e8e8e8] py-3" aria-label="Registration progress">
          <ol className="flex min-w-[650px] items-center justify-between gap-2">
            {steps.map((step, index) => (
              <li key={step} className="flex flex-1 items-center last:flex-none">
                <button type="button" onClick={() => index < currentStep && setCurrentStep(index)} aria-current={index === currentStep ? 'step' : undefined} className={`flex items-center gap-2 whitespace-nowrap text-sm ${index === currentStep ? 'font-semibold text-[#111]' : index < currentStep ? 'font-medium text-[#555]' : 'text-[#999]'}`}>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${index === currentStep ? 'border-[#E87532] text-[#E87532]' : index < currentStep ? 'border-[#333] bg-[#111] text-white' : 'border-[#dedede] text-[#777]'}`}>{index < currentStep ? <Check className="h-3.5 w-3.5" /> : `0${index + 1}`}</span>
                  <span>{step}</span>
                </button>
                {index < steps.length - 1 && <span className="mx-3 h-px min-w-5 flex-1 bg-[#e5e5e5]" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit} className="mt-7">
          {currentStep === 0 && <section aria-labelledby="register-step-title">
            <div className="mb-4"><h2 id="register-step-title" className="text-[22px] font-semibold tracking-[-.02em]">Choose your responsibility</h2><p className="mt-1 text-sm text-[#6b7280]">Select the workspace that best describes your role.</p></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = formData.role === opt.value;
                const roleAvatar = PROFILE_AVATARS.find((avatar) => avatar.id === opt.avatarId);
                return <button key={opt.value} type="button" onClick={() => handleSelectRole(opt.value)} aria-pressed={selected} className={`relative flex min-h-[300px] flex-col overflow-hidden rounded-xl border bg-white text-left transition-colors ${selected ? 'border-[#E87532]' : 'border-[#dedede] hover:border-[#b8b8b8]'}`}>
                  <div className="relative flex h-[132px] w-full items-center justify-center bg-[#f7f7f7]">
                    <img src={roleAvatar?.image} alt="" className="h-[122px] w-[122px] object-contain" />
                    {selected && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#E87532] text-white"><Check className="h-3.5 w-3.5" /></span>}
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                    <div className="flex items-start gap-2"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#333]" /><div><h3 className="text-[15px] font-semibold leading-5 text-[#171717]">{opt.role}</h3><p className="mt-1 text-[10px] font-medium uppercase tracking-[.08em] text-[#777]">{opt.badge}</p></div></div>
                    <ul className="mt-3 space-y-1.5">{opt.points.map((point) => <li key={point} className="flex items-center gap-2 text-[12px] text-[#62666b]"><Check className="h-3.5 w-3.5 shrink-0 text-[#E87532]" />{point}</li>)}</ul>
                  </div>
                </button>;
              })}
            </div>
          </section>}

          {currentStep === 1 && <section aria-labelledby="register-step-title">
            <div className="mb-5"><h2 id="register-step-title" className="text-[22px] font-semibold tracking-[-.02em]">Choose your profile avatar</h2><p className="mt-1 text-sm text-[#6b7280]">Choose an illustration for your safety profile, or use your initials.</p></div>
            <div className="flex flex-col gap-5 rounded-xl border border-[#e5e5e5] bg-white p-5 sm:flex-row sm:items-center sm:px-7">
              <div className="flex shrink-0 items-center gap-3">
                <span className={`flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border ${selectedAvatar ? 'border-[#E87532]' : 'border-[#dedede] bg-[#f5f5f5]'}`}>
                  {avatarPreview ? <ProfileAvatar avatarId={avatarPreview.id} /> : <span className="text-2xl font-semibold text-[#777]">{formData.name?.trim()?.[0]?.toUpperCase() || 'U'}</span>}
                </span>
                <button type="button" onClick={() => setAvatarBrowserOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dedede] text-[#444] hover:bg-[#f7f7f7]" aria-label={avatarBrowserOpen ? 'Close avatar browser' : 'Browse all avatars'} aria-expanded={avatarBrowserOpen}><ChevronDown className={`h-4 w-4 transition-transform ${avatarBrowserOpen ? 'rotate-180' : ''}`} /></button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#222]">{selectedAvatar ? selectedAvatar.displayLabel : 'Using initials'}</p>
                <p className="mt-1 text-xs text-[#777]">{selectedAvatar ? `${selectedAvatar.gender} profile avatar` : 'Choose an illustration below or keep your initials.'}</p>
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {PROFILE_AVATARS.slice(0, 8).map((avatar) => {
                    const selected = formData.avatarId === avatar.id;
                    return <button key={avatar.id} type="button" onClick={() => setFormData({ ...formData, avatarId: avatar.id })} aria-label={avatar.label} aria-pressed={selected} className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-[#f5f5f5] ${selected ? 'border-[#E87532] ring-1 ring-[#E87532]' : 'border-[#e1e1e1] hover:border-[#999]'}`}><ProfileAvatar avatarId={avatar.id} />{selected && <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#E87532] text-white"><Check className="h-3 w-3" /></span>}</button>;
                  })}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <button type="button" onClick={() => setAvatarBrowserOpen((open) => !open)} className="text-sm font-medium text-[#555] underline underline-offset-4">{avatarBrowserOpen ? 'Close avatar browser' : 'Browse avatars'}</button>
                <button type="button" onClick={() => setFormData({ ...formData, avatarId: null })} className={`text-sm underline underline-offset-4 ${formData.avatarId === null ? 'font-semibold text-[#222]' : 'text-[#777]'}`} aria-pressed={formData.avatarId === null}>Use initials instead</button>
              </div>
            </div>
            {avatarBrowserOpen && <div className="mt-5 max-h-[460px] space-y-4 overflow-y-auto pr-1">
              {AVATAR_GROUPS.map((group) => <section key={group.id} aria-label={group.label} className="rounded-lg border border-[#e8e8e8] p-4">
                <h3 className="mb-3 text-sm font-semibold text-[#333]">{group.label}</h3>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                  {group.avatars.map((avatar) => {
                    const selected = formData.avatarId === avatar.id;
                    return <button key={avatar.id} type="button" onClick={() => { setFormData({ ...formData, avatarId: avatar.id }); setAvatarBrowserOpen(false); }} aria-label={avatar.label} aria-pressed={selected} className={`relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2 ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-transparent hover:border-[#dedede] hover:bg-[#fafafa]'}`}>
                      <span className="relative h-14 w-14 overflow-hidden rounded-full border border-[#e1e1e1] bg-[#f5f5f5]"><ProfileAvatar avatarId={avatar.id} />{selected && <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#E87532] text-white"><Check className="h-3 w-3" /></span>}</span>
                      <span className="w-full truncate text-center text-[11px] font-medium text-[#333]">{avatar.displayLabel}</span><span className="text-[10px] text-[#777]">{avatar.gender}</span>
                    </button>;
                  })}
                </div>
              </section>)}
            </div>}
          </section>}

          {currentStep === 2 && <section aria-labelledby="register-step-title">
            <div className="mb-5"><h2 id="register-step-title" className="text-[22px] font-semibold tracking-[-.02em]">Personal information</h2><p className="mt-1 text-sm text-[#6b7280]">Add the information used to build your safety profile.</p></div>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <Input label={labels.name} name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required icon={User} />
              <Input label={labels.email} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@organization.com" required icon={Mail} />
              <Input label="Phone number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" icon={Phone} />
              <Input label="Alternate phone number" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} placeholder="Enter alternate phone number" icon={Phone} />
              <Input label="Blood group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" icon={Droplet} />
              <Input label="Date of birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} icon={CalendarDays} />
              <Input label="Residential address" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} placeholder="Enter residential address" icon={MapPin} />
              <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" icon={MapPin} />
              <Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" icon={MapPin} />
              <div className="sm:col-span-2"><h3 className="mb-3 border-b border-[#e8e8e8] pb-2 text-sm font-semibold text-[#333]">Emergency contact <span className="font-normal text-[#777]">(optional)</span></h3></div>
              <Input label="Emergency contact name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Enter contact name" icon={User} />
              <Input label="Emergency contact relationship" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleChange} placeholder="e.g. Spouse, parent" icon={Users} />
              <Input label="Emergency contact number" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} placeholder="Enter contact number" icon={Phone} />
              <div className="sm:col-span-2"><h3 className="mb-3 border-b border-[#e8e8e8] pb-2 text-sm font-semibold text-[#333]">Account security</h3></div>
              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required icon={Lock} />
            </div>
          </section>}

          {currentStep === 3 && <section aria-labelledby="register-step-title">
            <div className="mb-5"><h2 id="register-step-title" className="text-[22px] font-semibold tracking-[-.02em]">Work &amp; organization details</h2><p className="mt-1 text-sm text-[#6b7280]">Add the organization details supported by your workspace.</p></div>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
              <Input label={labels.org} name="factoryName" value={formData.factoryName} onChange={handleChange} placeholder="Organization / factory name" icon={Building} />
              <Input label={labels.id} name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee / officer ID" icon={BadgeCheck} />
              <Input label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Enter department" icon={Building} />
              <Input label="Designation / Job Title" name="designation" value={formData.designation} onChange={handleChange} placeholder="Enter designation" icon={BadgeCheck} />
              <Input label="Shift" name="shift" value={formData.shift} onChange={handleChange} placeholder="Enter shift" icon={Shield} />
              <Input label="Joining date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} icon={CalendarDays} />
              <Input label="Work location" name="workLocation" value={formData.workLocation} onChange={handleChange} placeholder="Enter work location" icon={MapPin} />
              <Input label="Supervisor / Reporting Manager" name="supervisor" value={formData.supervisor} onChange={handleChange} placeholder="Enter supervisor name" icon={User} />
              <Input label="Employment type" name="employmentType" value={formData.employmentType} onChange={handleChange} placeholder="e.g. Full-time, contract" icon={BadgeCheck} />
              <Input label="Employee status" name="employeeStatus" value={formData.employeeStatus} onChange={handleChange} placeholder="e.g. Active" icon={Shield} />
            </div>
          </section>}

          {currentStep === 4 && <section aria-labelledby="register-step-title">
            <div className="mb-5"><h2 id="register-step-title" className="text-[22px] font-semibold tracking-[-.02em]">Review &amp; create</h2><p className="mt-1 text-sm text-[#6b7280]">Confirm the information for your new safety workspace.</p></div>
            <div className="grid items-start gap-4 lg:grid-cols-3">
              <section className="rounded-lg border border-[#e5e5e5] p-4" aria-label="Profile review">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Profile</h3><button type="button" onClick={() => setCurrentStep(0)} className="text-xs font-medium text-[#555] underline underline-offset-4">Edit</button></div>
                <div className="flex items-center gap-3"><span className="h-14 w-14 overflow-hidden rounded-full border border-[#e5e5e5] bg-[#f5f5f5]">{selectedAvatar ? <ProfileAvatar avatarId={selectedAvatar.id} /> : <span className="flex h-full items-center justify-center text-lg font-semibold text-[#777]">{formData.name?.trim()?.[0]?.toUpperCase() || 'U'}</span>}</span><div><p className="text-sm font-semibold">{selectedRoleOption.role}</p><p className="mt-1 text-xs text-[#666]">{selectedAvatar ? selectedAvatar.displayLabel : 'Using initials'}</p></div></div>
                <p className="mt-3 border-t border-[#eee] pt-3 text-sm text-[#333]">{formData.name || 'Not provided'}</p>
              </section>
              <section className="rounded-lg border border-[#e5e5e5] p-4" aria-label="Personal information review">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Personal information</h3><button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-medium text-[#555] underline underline-offset-4">Edit</button></div>
                <div className="space-y-4">{personalReviewGroups.map((group) => <div key={group.title}><h4 className="mb-2 border-b border-[#eee] pb-1.5 text-xs font-semibold text-[#555]">{group.title}</h4><dl className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">{group.fields.map((field) => <div key={field.label} className="min-w-0"><dt className="text-[11px] text-[#777]">{field.label}</dt><dd className="break-words text-[13px] text-[#333]">{field.value || 'Not provided'}</dd></div>)}<div className="min-w-0"><dt className="text-[11px] text-[#777]">Password</dt><dd className="text-[13px] text-[#333]">{formData.password ? '••••••••' : 'Not provided'}</dd></div></dl></div>)}</div>
              </section>
              <section className="rounded-lg border border-[#e5e5e5] p-4" aria-label="Work details review">
                <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">Work &amp; organization</h3><button type="button" onClick={() => setCurrentStep(3)} className="text-xs font-medium text-[#555] underline underline-offset-4">Edit</button></div>
                <div className="space-y-4">{workReviewGroups.map((group) => <div key={group.title}><h4 className="mb-2 border-b border-[#eee] pb-1.5 text-xs font-semibold text-[#555]">{group.title}</h4><dl className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">{group.fields.map((field) => <div key={field.label} className="min-w-0"><dt className="text-[11px] text-[#777]">{field.label}</dt><dd className="break-words text-[13px] text-[#333]">{field.value || 'Not provided'}</dd></div>)}</dl></div>)}</div>
              </section>
            </div>
          </section>}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e8e8e8] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-[#666]"><Shield className="h-4 w-4 text-[#E87532]" /><span>Selected: <strong className="font-semibold text-[#222]">{selectedRoleOption.role}</strong></span></div>
            <div className="flex justify-end gap-3">
              {currentStep > 0 && <button type="button" onClick={() => { setCurrentStep((step) => step - 1); setAvatarBrowserOpen(false); }} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-[#dedede] bg-white px-5 text-sm font-semibold text-[#333] hover:bg-[#f7f7f7]"><ArrowLeft className="h-4 w-4" />Back</button>}
              <button type="submit" disabled={loading} className="flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-[#111] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50">{currentStep === steps.length - 1 ? (loading ? 'Creating account...' : <>Create Profile <ArrowRight className="h-4 w-4" /></>) : <>Next <ArrowRight className="h-4 w-4" /></>}</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
