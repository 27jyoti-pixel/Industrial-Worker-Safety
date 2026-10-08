import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import profileHeroRefinery from '../assets/profile-hero-refinery.png';

import {
  User,
  Mail,
  Building,
  KeyRound,
  Lock,
  Phone,
  IdCard,
  BriefcaseBusiness,
  BadgeCheck,
  Clock3,
  CalendarDays,
  MapPin,
  UserRound,
  UsersRound,
  Droplet,
  Check,
  Pencil,
  X
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import { AVATAR_GROUPS, resolveProfileAvatarId } from '../components/profile/profileAvatarOptions';

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const formatProfileDate = (value) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const profileDisplayValue = (value) => (
  value === undefined || value === null || String(value).trim() === '' ? 'Not provided' : value
);

const Profile = () => {
  const { user, updateProfile: persistProfileUpdate } = useAuth();
  const { showSuccess, showError } = useToast();

  const [passwordEmail, setPasswordEmail] = useState(user?.email || '');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(user?.avatarId || null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    alternatePhone: user?.alternatePhone || '',
    bloodGroup: user?.bloodGroup || '',
    dateOfBirth: toDateInputValue(user?.dateOfBirth),
    residentialAddress: user?.residentialAddress || '',
    city: user?.city || '',
    state: user?.state || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactRelationship: user?.emergencyContactRelationship || '',
    emergencyContactNumber: user?.emergencyContactNumber || '',
    factoryName: user?.factoryName || '',
    employeeId: user?.employeeId || '',
    department: user?.department || '',
    designation: user?.designation || '',
    shift: user?.shift || '',
    joiningDate: toDateInputValue(user?.joiningDate),
    workLocation: user?.workLocation || '',
    supervisor: user?.supervisor || '',
    employmentType: user?.employmentType || '',
    employeeStatus: user?.employeeStatus || ''
  });

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      phone: user?.phone || '',
      alternatePhone: user?.alternatePhone || '',
      bloodGroup: user?.bloodGroup || '',
      dateOfBirth: toDateInputValue(user?.dateOfBirth),
      residentialAddress: user?.residentialAddress || '',
      city: user?.city || '',
      state: user?.state || '',
      emergencyContactName: user?.emergencyContactName || '',
      emergencyContactRelationship: user?.emergencyContactRelationship || '',
      emergencyContactNumber: user?.emergencyContactNumber || '',
      factoryName: user?.factoryName || '',
      employeeId: user?.employeeId || '',
      department: user?.department || '',
      designation: user?.designation || '',
      shift: user?.shift || '',
      joiningDate: toDateInputValue(user?.joiningDate),
      workLocation: user?.workLocation || '',
      supervisor: user?.supervisor || '',
      employmentType: user?.employmentType || '',
      employeeStatus: user?.employeeStatus || ''
    });

    setPasswordEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    if (!avatarPickerOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setAvatarPickerOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [avatarPickerOpen]);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.forgotPassword(passwordEmail);

      showSuccess(res.message || 'Password reset token dispatched to email!');

      if (res.resetToken) {
        setResetToken(res.resetToken);
      }

      setResetStep(2);
    } catch (err) {
      showError(err.message || 'Failed to request password reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetToken || !newPassword) {
      showError('Please provide both reset token and new password');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(resetToken, newPassword);

      showSuccess('Password updated successfully!');

      setResetStep(1);
      setNewPassword('');
    } catch (err) {
      showError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await persistProfileUpdate(profileData);

      showSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    setAvatarSaving(true);
    try {
      await persistProfileUpdate({ avatarId: selectedAvatarId });
      setAvatarPickerOpen(false);
      showSuccess('Profile avatar updated successfully.');
    } catch (err) {
      showError(err.message || 'Failed to update profile avatar.');
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);

    if (section === 'profile') {
      setEditMode(false);
    }
  };

  const updateProfileField = (field, value) => {
    setProfileData((current) => ({ ...current, [field]: value }));
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const selectedAvatarDisplayId = resolveProfileAvatarId(selectedAvatarId, user?.role);
  const cityState = [user?.city, user?.state].filter((value) => value && String(value).trim()).join(', ');

  const selectProfileTab = (tab) => {
    setActiveTab(tab);
    handleSectionChange(tab === 'security' ? 'password' : 'profile');
  };

  return (
    <>
      <style>{`
        .profile-tab { transition: color 150ms ease, border-color 150ms ease, background-color 150ms ease; }
        .profile-information-row { min-height: 48px; }
        .profile-information-content { display: block; }
        .profile-personal-content {
          width: 100%;
          max-width: 680px;
          margin-inline: auto;
        }
        .profile-section-nav { scrollbar-width: none; }
        .profile-section-nav::-webkit-scrollbar { display: none; }
        #profile-redesign .profile-edit-button:focus-visible { outline: none; box-shadow: none; }
        .profile-security-content .security-field label { margin-bottom: 4px; color: #536982; font-size: 13px; font-weight: 500; }
        .profile-security-content .security-field input { border-color: #dfe2e5; border-radius: 7px; padding-top: 8px; padding-bottom: 8px; font-size: 14px; line-height: 20px; }
        .profile-tab-content-area {
          box-sizing: border-box;
          align-items: center;
          height: max(220px, calc(100dvh - 472px));
          min-height: 0;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .profile-tab-content-area > div { width: 100%; max-width: 560px; margin-inline: auto; transform: translateX(12px); }
        .profile-tab-content-area::-webkit-scrollbar { display: none; }
        .profile-personal-row { min-height: 56px; }
        #profile-redesign .profile-hero-avatar { border-radius: 50% !important; }
        #profile-redesign .profile-hero-avatar > img { border-radius: 50% !important; }
        #profile-redesign .profile-designation-value { font-size: clamp(26px, 2vw, 30px) !important; font-weight: 600 !important; }
        .profile-hero-curtain {
          -webkit-backdrop-filter: blur(2px);
          backdrop-filter: blur(2px);
        }
        .profile-hero-curtain::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, .84);
          -webkit-mask-image: radial-gradient(ellipse 38% 100% at 50% 50%, #000 0%, #000 54%, rgba(0, 0, 0, .88) 80%, transparent 100%);
          mask-image: radial-gradient(ellipse 38% 100% at 50% 50%, #000 0%, #000 54%, rgba(0, 0, 0, .88) 80%, transparent 100%);
        }
        #profile-redesign input:focus {
          border-color: #F2C7B0 !important;
          box-shadow: none !important;
          outline: none;
        }
        #profile-redesign button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, .18);
        }
        #profile-redesign button:hover { transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .profile-tab { transition: none !important; }
        }
        @media (min-width: 1024px) {
          #profile-redesign { display: flex; flex-direction: column; height: calc(100dvh - 74px); min-height: 0; margin-bottom: -32px; }
          #profile-redesign .profile-hero-section { flex: 1 1 0; height: auto; min-height: 0; }
          #profile-redesign .profile-hero-content { height: 100%; min-height: 0; }
          #profile-redesign .profile-details-shell { flex: none; }
          #profile-redesign .profile-hero-avatar { width: clamp(150px, 21dvh, 180px) !important; height: clamp(150px, 21dvh, 180px) !important; border-radius: 50% !important; }
        }
      `}</style>

      <div id="profile-redesign" className="profile-redesign isolate relative left-1/2 -mt-4 w-screen -translate-x-1/2 sm:-mt-6 lg:-mt-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${profileHeroRefinery})` }} />
        <div className="profile-hero-curtain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <section className="profile-hero-section relative min-h-[490px] bg-transparent sm:min-h-[440px] lg:h-[380px] lg:min-h-[380px]" aria-label="Profile hero">
          <div className="profile-hero-content relative mx-auto grid min-h-[490px] w-full grid-cols-1 items-center gap-3 px-6 py-8 sm:min-h-[440px] sm:px-10 lg:h-[380px] lg:min-h-[380px] lg:-translate-y-[128px] lg:grid-cols-[minmax(0,1fr)_minmax(160px,205px)_minmax(0,1fr)] lg:gap-6 lg:px-[6vw] lg:py-0">
            <div className="order-2 z-10 mx-auto w-full max-w-[300px] text-left lg:order-1 lg:col-start-1 lg:mx-0 lg:justify-self-end lg:pr-4 lg:translate-x-[112px]">
              <p className="text-[13px] font-semibold tracking-[.06em] text-[#526274]">DESIGNATION</p>
              <h1 className="profile-designation-value mt-2 text-[26px] font-semibold leading-tight tracking-[-.02em] text-[#111] sm:text-[28px]">{profileDisplayValue(user?.designation || user?.role)}</h1>
              <div className="mt-4 h-[2px] w-[70px] bg-[#E87532]" />
            </div>

            <button
              type="button"
              onClick={() => { setSelectedAvatarId(user?.avatarId || null); setAvatarPickerOpen(true); }}
              aria-label="Change profile avatar"
              title="Change profile avatar"
              className="profile-hero-avatar group relative order-1 mx-auto h-[170px] w-[170px] overflow-hidden rounded-full border-[5px] border-white bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87532] sm:h-[190px] sm:w-[190px] lg:order-2 lg:col-start-2 lg:h-[180px] lg:w-[180px] lg:-translate-x-4"
            >
              <ProfileAvatar avatarId={user?.avatarId} role={user?.role} initials={initials} />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true"><Pencil className="h-5 w-5" /></span>
            </button>

            <div className="order-3 z-10 mx-auto w-full max-w-[350px] text-left lg:col-start-3 lg:mx-0 lg:max-w-[340px] lg:translate-x-14">
              <p className="text-[13px] font-semibold tracking-[.04em] text-[#263c54]">COMMITTED TO</p>
              <h2 className="mt-2 text-[27px] font-bold leading-[1.05] tracking-[-.035em] text-[#111] sm:text-[30px]">Safer People.<br />Stronger<br /><span className="text-[#f2670a]">Industries.</span></h2>
              <div className="mt-5 h-[2px] w-[78px] bg-[#f2670a]" />
            </div>
          </div>
        </section>

        <div className="profile-details-shell relative z-20 mx-auto -mt-6 w-[calc(100%-2rem)] max-w-[800px] sm:w-[calc(100%-3rem)] lg:-mt-36 lg:-translate-y-24">
        <nav className="profile-section-nav flex min-w-0 justify-center overflow-x-auto border-b border-[#dfe2e5] bg-transparent px-4 sm:px-8" aria-label="Profile sections">
          <div className="flex w-[96%] shrink-0 items-center justify-between">
          {[
            ['personal', 'Personal Info'],
            ['work', 'Work Details'],
            ['security', 'Password Reset'],
          ].map(([tab, label]) => {
            const selected = activeTab === tab || (tab === 'security' && activeSection === 'password');
            return (
              <button
                key={tab}
                type="button"
                onClick={() => selectProfileTab(tab)}
                aria-current={selected ? 'page' : undefined}
                className={`profile-tab relative min-h-[52px] shrink-0 border-b-2 px-1 text-[14px] font-medium sm:text-[15px] ${selected ? 'border-[#f2670a] text-[#111]' : 'border-transparent text-[#536982] hover:text-[#222]'}`}
              >
                {label}
              </button>
            );
          })}
          <span className="flex min-h-[52px] shrink-0 cursor-not-allowed items-center border-b-2 border-transparent px-1 text-[14px] font-medium text-[#a1a3a6] sm:text-[15px]" aria-disabled="true" title="Notifications are not available in this profile yet">Notifications</span>
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className="profile-edit-button my-auto min-h-9 shrink-0 rounded-[7px] border-0 bg-[#111] px-4 text-[13px] font-semibold text-white shadow-none outline-none hover:bg-[#292929]"
          >
            {editMode ? 'Cancel edit' : 'Edit Profile'}
          </button>
          </div>
        </nav>

        <section className="profile-tab-content-area flex flex-none min-h-0 flex-col bg-transparent px-5 pb-4 pt-2 sm:px-8 sm:pb-5 sm:pt-2" aria-label="Profile details">
          {activeSection === 'profile' && !editMode && activeTab === 'personal' && (
            <div className="profile-information-content profile-personal-content mt-4">
              <div className="profile-information-grid grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
                {[
                  { label: 'Full Name', value: user?.name, Icon: User },
                  { label: 'Email Address', value: user?.email, Icon: Mail },
                  { label: 'Phone Number', value: user?.phone, Icon: Phone },
                  { label: 'Alternate Phone Number', value: user?.alternatePhone, Icon: Phone },
                  { label: 'Blood Group', value: user?.bloodGroup, Icon: Droplet },
                  { label: 'Date of Birth', value: formatProfileDate(user?.dateOfBirth), Icon: CalendarDays },
                  { label: 'Residential Address', value: user?.residentialAddress, Icon: MapPin },
                  { label: 'City / State', value: cityState, Icon: MapPin },
                  { label: 'Emergency Contact Name', value: user?.emergencyContactName, Icon: UserRound },
                  { label: 'Emergency Contact Relationship', value: user?.emergencyContactRelationship, Icon: UsersRound },
                  { label: 'Emergency Contact Number', value: user?.emergencyContactNumber, Icon: Phone },
                ].map(({ label, value, Icon }, index) => (
                  <div key={label} className="profile-information-row profile-personal-row flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full ${['bg-[#fff0e5] text-[#ef6709]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#edf1f6] text-[#526982]', 'bg-[#edf1f6] text-[#526982]', 'bg-[#fdebed] text-[#e33346]', 'bg-[#fff0e5] text-[#ef6709]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#e4f8f0] text-[#18a86b]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#edf1f6] text-[#526982]'][index]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#536982]">{label}</p>
                      <p className="break-words text-[14px] font-semibold text-[#17191c]">{profileDisplayValue(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && !editMode && activeTab === 'work' && (
            <div className="profile-information-content profile-work-content mt-4">
              <div className="profile-information-grid grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {[
                  { label: 'Employee ID', value: user?.employeeId, Icon: IdCard },
                  { label: 'Role', value: user?.role, Icon: BriefcaseBusiness },
                  { label: 'Factory Unit', value: user?.factoryName, Icon: Building },
                  { label: 'Department', value: user?.department, Icon: Building },
                  { label: 'Designation / Job Title', value: user?.designation, Icon: BriefcaseBusiness },
                  { label: 'Shift', value: user?.shift, Icon: Clock3 },
                  { label: 'Joining Date', value: formatProfileDate(user?.joiningDate), Icon: CalendarDays },
                  { label: 'Work Location', value: user?.workLocation, Icon: MapPin },
                  { label: 'Supervisor / Reporting Manager', value: user?.supervisor, Icon: UserRound },
                  { label: 'Employment Type', value: user?.employmentType, Icon: BriefcaseBusiness },
                  { label: 'Employee Status', value: user?.employeeStatus, Icon: BadgeCheck },
                ].map(({ label, value, Icon }, index) => (
                  <div key={label} className="profile-information-row profile-personal-row flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full ${['bg-[#e8f1ff] text-[#1476e8]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#fff0e5] text-[#ef6709]', 'bg-[#e4f8f0] text-[#18a86b]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#fff0e5] text-[#ef6709]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#e4f8f0] text-[#18a86b]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#fff0e5] text-[#ef6709]', 'bg-[#e4f8f0] text-[#18a86b]'][index]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#536982]">{label}</p>
                      <p className="break-words text-[14px] font-semibold text-[#17191c]">{profileDisplayValue(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && editMode && (
            <div>
              <form onSubmit={handleUpdateProfile} className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                <Input label="Phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                {[
                  { field: 'alternatePhone', label: 'Alternate Phone Number' },
                  { field: 'bloodGroup', label: 'Blood Group' },
                  { field: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                  { field: 'residentialAddress', label: 'Residential Address' },
                  { field: 'city', label: 'City' },
                  { field: 'state', label: 'State' },
                  { field: 'emergencyContactName', label: 'Emergency Contact Name' },
                  { field: 'emergencyContactRelationship', label: 'Emergency Contact Relationship' },
                  { field: 'emergencyContactNumber', label: 'Emergency Contact Number' },
                  { field: 'department', label: 'Department' },
                  { field: 'designation', label: 'Designation / Job Title' },
                  { field: 'shift', label: 'Shift' },
                  { field: 'joiningDate', label: 'Joining Date', type: 'date' },
                  { field: 'workLocation', label: 'Work Location' },
                  { field: 'supervisor', label: 'Supervisor / Reporting Manager' },
                  { field: 'employmentType', label: 'Employment Type' },
                  { field: 'employeeStatus', label: 'Employee Status' },
                ].map(({ field, label, type = 'text' }) => (
                  <Input
                    key={field}
                    label={label}
                    type={type}
                    value={profileData[field]}
                    onChange={(e) => updateProfileField(field, e.target.value)}
                  />
                ))}
                {(user?.role === 'Worker' || user?.role === 'Factory Admin') && (
                  <Input label="Factory Name" value={profileData.factoryName} onChange={(e) => setProfileData({ ...profileData, factoryName: e.target.value })} />
                )}
                {user?.role === 'Worker' && <Input label="Employee ID" value={profileData.employeeId} disabled />}
                <div className="flex justify-end gap-3 pt-3 sm:col-span-2">
                  <Button type="button" variant="secondary" onClick={() => setEditMode(false)} className="!rounded-[7px] !border !border-[#dedede] !bg-white !text-[#222] !shadow-none hover:!bg-[#f7f7f7]">Cancel</Button>
                  <Button type="submit" variant="primary" loading={loading} className="!rounded-[7px] !bg-[#111] !text-white !shadow-none hover:!bg-[#2a2a2a]">Save changes</Button>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="profile-security-content mt-6">
              {resetStep === 1 ? (
                <form onSubmit={handleRequestToken} className="profile-information-grid grid grid-cols-1 items-start gap-x-12 gap-y-3 sm:grid-cols-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e9ff] text-[#8641dd]">
                      <KeyRound className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-col items-start">
                      <p className="text-[13px] leading-5 text-[#536982]">A secure reset token will be sent to your registered account email.</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff] text-[#1476e8]">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="security-email-value min-w-0">
                      <label className="mb-1 block text-[13px] font-medium text-[#536982]">Registered Account Email</label>
                      <p className="break-words text-[14px] font-semibold text-[#17191c]">{profileDisplayValue(passwordEmail)}</p>
                    </div>
                  </div>
                  <div className="col-span-full mt-3 flex justify-center">
                    <Button type="submit" variant="primary" size="sm" loading={loading} icon={KeyRound} className="relative -left-3 w-fit !rounded-[7px] !bg-[#111] !text-white !shadow-none hover:!bg-[#2a2a2a]">Request reset token</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="profile-information-grid grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <Input className="security-field" label="Password Reset Token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste token received" required />
                  <Input className="security-field" label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={Lock} required />
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Button type="submit" variant="primary" loading={loading} className="!rounded-[7px] !bg-[#111] !text-white !shadow-none hover:!bg-[#2a2a2a]">Reset password</Button>
                    <Button type="button" variant="secondary" onClick={() => setResetStep(1)} className="!rounded-[7px] !border !border-[#dedede] !bg-white !text-[#222] !shadow-none hover:!bg-[#f7f7f7]">Back</Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </div>
      </div>
      {avatarPickerOpen && createPortal((
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAvatarPickerOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="avatar-picker-title" className="flex max-h-[90vh] w-full max-w-[940px] flex-col overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white p-4 shadow-[0_12px_36px_rgba(17,17,17,.16)] sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="avatar-picker-title" className="text-[17px] font-semibold text-[#111]">Change profile avatar</h2>
                <p className="mt-1 text-[13px] text-[#70747a]">Choose an illustrated avatar or use your initials.</p>
              </div>
              <button type="button" onClick={() => setAvatarPickerOpen(false)} aria-label="Close avatar picker" className="rounded-md p-1.5 text-[#666] hover:bg-[#f5f5f5] hover:text-[#111]"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedAvatarId(null)}
                aria-label="Use initials"
                aria-pressed={selectedAvatarId === null}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${selectedAvatarId === null ? 'border-[#E87532] bg-[#fffaf7]' : 'border-[#e7e7e7] hover:bg-[#fafafa]'}`}
              >
                <span className={`block h-11 w-11 overflow-hidden rounded-full ${selectedAvatarId === null ? 'ring-2 ring-[#E87532] ring-offset-1' : 'ring-1 ring-[#e1e1e1]'}`}><ProfileAvatar initials={initials} /></span>
                <span className="text-[12px] font-semibold text-[#222]">Use initials</span>
                {selectedAvatarId === null && <Check className="ml-1 h-4 w-4 text-[#E87532]" />}
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                {AVATAR_GROUPS.map((group) => (
                  <section key={group.id} className="min-w-0 rounded-lg border border-[#ededed] p-2.5">
                    <h3 className="mb-2 inline-flex rounded-md bg-[#f3f4f4] px-2.5 py-1 text-[12px] font-semibold text-[#303438]">{group.label} <span className="ml-1 font-normal text-[#73777c]">(4 options)</span></h3>
                    <div className="grid grid-cols-4 gap-1">
                      {group.avatars.map((avatar) => {
                        const selected = selectedAvatarDisplayId === avatar.id;
                        return (
                          <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setSelectedAvatarId(avatar.id)}
                            aria-label={avatar.label}
                            aria-pressed={selected}
                            className={`relative flex min-w-0 flex-col items-center gap-1 rounded-md border px-1 py-1.5 text-center transition-colors ${selected ? 'border-[#E87532] bg-[#fffaf7]' : 'border-transparent hover:border-[#e3e3e3] hover:bg-[#fafafa]'}`}
                          >
                            <span className={`block h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12 ${selected ? 'ring-2 ring-[#E87532] ring-offset-1' : 'ring-1 ring-[#e1e1e1]'}`}><ProfileAvatar avatarId={avatar.id} role={user?.role} /></span>
                            <span className="w-full truncate text-[9px] font-medium leading-3 text-[#32363a] sm:text-[10px]">{avatar.displayLabel}</span>
                            <span className="text-[9px] leading-3 text-[#777]">{avatar.gender}</span>
                            {selected && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E87532] text-white"><Check className="h-3 w-3" /></span>}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-[#ededed] pt-4">
              <button type="button" onClick={() => setAvatarPickerOpen(false)} disabled={avatarSaving} className="min-h-9 rounded-md border border-[#dedede] bg-white px-3.5 text-[13px] font-medium text-[#333] hover:bg-[#f7f7f7] disabled:opacity-60">Cancel</button>
              <button type="button" onClick={handleSaveAvatar} disabled={avatarSaving} className="min-h-9 rounded-md bg-[#111] px-4 text-[13px] font-medium text-white hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60">{avatarSaving ? 'Saving…' : 'Save'}</button>
            </div>
          </section>
        </div>
      ), document.body)}
    </>
  );
};

export default Profile;
