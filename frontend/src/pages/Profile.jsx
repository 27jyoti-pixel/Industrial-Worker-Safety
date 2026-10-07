import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import profileCover from '../assets/profile-cover-zoomed-out.png';
import heroWorkers from '../assets/landing/hero-workers.png';

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
  HardHat,
  ShieldCheck,
  Settings,
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
        .profile-cover-image { object-position: 56% 56%; }
        .profile-tab { transition: color 150ms ease, border-color 150ms ease, background-color 150ms ease; }
        .profile-information-row { min-height: 72px; }
        .profile-information-content { display: block; }
        .profile-details-scroll { scrollbar-width: thin; scrollbar-color: #e87532 #f1f1f1; }
        .profile-details-scroll::-webkit-scrollbar { width: 7px; }
        .profile-details-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 8px; }
        .profile-details-scroll::-webkit-scrollbar-thumb { background: #e87532; border-radius: 8px; }
        .profile-orbit { border: 1px solid rgba(117, 129, 143, .55); border-radius: 9999px; }
        .profile-orbit.profile-orbit-orange { border-color: rgba(232, 117, 50, .65); }
        @media (max-width: 767px) {
          .profile-orbiting-icons { display: none; }
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
        @media (max-width: 639px) { .profile-cover-image { object-position: 63% center; } }
        @media (prefers-reduced-motion: reduce) {
          .profile-tab, .profile-cover-image { transition: none !important; }
        }
      `}</style>

      <div id="profile-redesign" className="profile-redesign relative left-1/2 -mt-4 w-screen -translate-x-1/2 sm:-mt-6 lg:-mt-8">
        <section className="relative isolate min-h-[480px] overflow-hidden bg-[#f4e8dc] sm:min-h-[420px] lg:h-[380px] lg:min-h-[380px]" aria-label="Profile hero">
          <img src={profileCover} alt="Industrial refinery at sunset" className="profile-cover-image absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="relative mx-auto grid min-h-[480px] w-full grid-cols-1 items-center gap-3 px-5 py-8 sm:min-h-[420px] sm:px-8 lg:h-[380px] lg:min-h-[380px] lg:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)_minmax(0,1fr)] lg:gap-0 lg:px-[4.8vw] lg:py-0">
            <div className="order-1 z-10 flex flex-col items-start lg:pl-1">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => { setSelectedAvatarId(user?.avatarId || null); setAvatarPickerOpen(true); }}
                  aria-label="Change profile avatar"
                  title="Change profile avatar"
                  className="group relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87532] sm:h-[74px] sm:w-[74px]"
                >
                  <ProfileAvatar avatarId={user?.avatarId} role={user?.role} initials={initials} />
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true"><Pencil className="h-4 w-4" /></span>
                </button>
                <div className="min-w-0">
                  <h1 className="!mb-0 truncate !text-[32px] !font-semibold !leading-[1.05] !tracking-[-.035em] !text-[#111] sm:!text-[38px]">{user?.name || 'User'}</h1>
                  <p className="mt-1 truncate text-[15px] font-medium text-[#3b5571]">{user?.designation || user?.role || 'User'}</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="mt-4 !min-h-[50px] !rounded-[8px] !bg-[#f2670a] !px-8 !font-semibold !text-white !shadow-none hover:!bg-[#df5b05]"
              >
                <span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" />{editMode ? 'Cancel edit' : 'Edit Profile'}</span>
              </Button>
            </div>

            <div className="relative order-2 mx-auto flex h-[250px] w-[250px] items-center justify-center sm:h-[290px] sm:w-[290px] lg:h-[360px] lg:w-[360px] lg:-translate-x-12" aria-label="Worker safety portrait">
              <div className="profile-orbit absolute inset-0 scale-[1.02]" aria-hidden="true" />
              <div className="profile-orbit profile-orbit-orange absolute inset-[13px]" aria-hidden="true" />
              <div className="profile-orbit absolute inset-[28px] border-dashed" aria-hidden="true" />
              <div className="relative z-10 h-[72%] w-[72%] overflow-hidden rounded-full border-[7px] border-white bg-white shadow-[0_5px_16px_rgba(30,40,50,.16)]">
                <img src={heroWorkers} alt="Industrial safety workers" className="h-full w-full object-cover object-[58%_center]" />
              </div>
              <span className="absolute left-[5%] top-[22%] h-2.5 w-2.5 rounded-full bg-[#f2670a]" aria-hidden="true" />
              <span className="absolute right-[12%] top-[9%] h-2 w-2 rounded-full bg-[#f2670a]" aria-hidden="true" />
              <span className="absolute bottom-[3%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#f2670a]" aria-hidden="true" />
              <div className="profile-orbiting-icons absolute inset-0" aria-hidden="true">
                <span className="absolute left-[13%] top-[13%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#f2670a] shadow-sm"><HardHat className="h-6 w-6" /></span>
                <span className="absolute right-[2%] top-[34%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#f2670a] shadow-sm"><ShieldCheck className="h-6 w-6" /></span>
                <span className="absolute bottom-[11%] left-[13%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#f2670a] shadow-sm"><UsersRound className="h-6 w-6" /></span>
                <span className="absolute bottom-[12%] right-[12%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#f2670a] shadow-sm"><Settings className="h-6 w-6" /></span>
              </div>
            </div>

            <div className="order-3 z-10 mx-auto w-full max-w-[350px] text-left lg:mx-0 lg:max-w-[340px]">
              <p className="text-[13px] font-semibold tracking-[.04em] text-[#263c54]">COMMITTED TO</p>
              <h2 className="mt-2 text-[30px] font-bold leading-[1.05] tracking-[-.035em] text-[#111] sm:text-[36px]">Safer People.<br />Stronger<br /><span className="text-[#f2670a]">Industries.</span></h2>
              <div className="mt-5 h-[2px] w-[78px] bg-[#f2670a]" />
            </div>
          </div>
        </section>

        <div className="relative z-20 mx-auto -mt-2 w-[calc(100%-2rem)] max-w-[1040px] overflow-hidden rounded-[16px] border border-[#e8eaed] bg-white shadow-[0_6px_22px_rgba(20,30,45,.08)] sm:w-[calc(100%-3rem)]">
        <nav className="flex min-w-0 overflow-x-auto border-b border-[#e8eaed] bg-white px-4 sm:px-8" aria-label="Profile sections">
          {[
            ['personal', 'Personal Info'],
            ['work', 'Work Details'],
            ['security', 'Security'],
          ].map(([tab, label]) => {
            const selected = activeTab === tab || (tab === 'security' && activeSection === 'password');
            return (
              <button
                key={tab}
                type="button"
                onClick={() => selectProfileTab(tab)}
                aria-current={selected ? 'page' : undefined}
                className={`profile-tab relative min-h-[58px] shrink-0 border-b-2 px-3 text-[14px] font-medium sm:px-7 sm:text-[15px] ${selected ? 'border-[#f2670a] text-[#111]' : 'border-transparent text-[#536982] hover:text-[#222]'}`}
              >
                {label}
              </button>
            );
          })}
          <span className="flex min-h-[58px] shrink-0 cursor-not-allowed items-center border-b-2 border-transparent px-3 text-[14px] font-medium text-[#a1a3a6] sm:px-7 sm:text-[15px]" aria-disabled="true" title="Notifications are not available in this profile yet">Notifications</span>
        </nav>

        <section className="flex min-h-0 flex-1 flex-col bg-white px-5 pb-4 pt-4 sm:px-8 sm:pb-5 sm:pt-4" aria-label="Profile details">
          {activeSection === 'profile' && !editMode && activeTab === 'personal' && (
            <div className="profile-information-content profile-details-scroll max-h-[380px] overflow-y-auto pr-2">
              <div className="profile-information-grid grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
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
                  <div key={label} className="profile-information-row flex min-w-0 items-center gap-3 py-1.5 sm:gap-4">
                    <span className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full ${['bg-[#fff0e5] text-[#ef6709]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#edf1f6] text-[#526982]', 'bg-[#edf1f6] text-[#526982]', 'bg-[#fdebed] text-[#e33346]', 'bg-[#fff0e5] text-[#ef6709]', 'bg-[#e8f1ff] text-[#1476e8]', 'bg-[#e4f8f0] text-[#18a86b]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#f0e9ff] text-[#8641dd]', 'bg-[#edf1f6] text-[#526982]'][index]}`}><Icon className="h-6 w-6" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-[14px] text-[#536982]">{label}</p>
                      <p className="mt-1 break-words text-[15px] font-semibold text-[#17191c]">{profileDisplayValue(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && !editMode && activeTab === 'work' && (
            <div className="profile-information-content profile-details-scroll max-h-[380px] overflow-y-auto pr-2">
              <div className="profile-information-grid grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
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
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="profile-information-row flex min-w-0 items-center gap-3 py-1.5 sm:gap-4">
                    <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#edf1f6] text-[#526982]"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-[14px] text-[#536982]">{label}</p>
                      <p className="mt-1 break-words text-[15px] font-semibold text-[#17191c]">{profileDisplayValue(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && editMode && (
            <div>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#17191c]">Edit profile information</h2>
                <p className="mt-1 text-[13px] text-[#73777c]">Update the information connected to your account.</p>
              </div>
              <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            <div>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#17191c]">Password reset</h2>
                <p className="mt-1 text-[13px] text-[#73777c]">Securely reset the password connected to your account.</p>
              </div>
              {resetStep === 1 ? (
                <form onSubmit={handleRequestToken} className="max-w-2xl">
                  <div className="mb-5 rounded-[8px] border border-[#e7e7e7] bg-[#fafafa] p-4">
                    <div className="flex items-start gap-3">
                      <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[#444]" aria-hidden="true" />
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#222]">Request a reset token</h3>
                        <p className="mt-1 text-[12px] leading-5 text-[#6c7075]">A secure reset token will be sent to your registered account email.</p>
                      </div>
                    </div>
                  </div>
                  <Input label="Registered Account Email" type="email" value={passwordEmail} onChange={(e) => setPasswordEmail(e.target.value)} icon={Mail} required />
                  <div className="mt-5">
                    <Button type="submit" variant="primary" loading={loading} icon={KeyRound} className="!rounded-[7px] !bg-[#111] !text-white !shadow-none hover:!bg-[#2a2a2a]">Request reset token</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="max-w-2xl space-y-5">
                  <Input label="Password Reset Token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste token received" required />
                  <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={Lock} required />
                  <div className="flex items-center gap-3 pt-2">
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
