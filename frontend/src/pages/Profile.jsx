import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import profileCover from '../assets/profile-cover-zoomed-out.png';

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
import { AVATAR_GROUPS, PROFILE_AVATARS, resolveProfileAvatarId } from '../components/profile/profileAvatarOptions';

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
  const headerAvatarId = avatarPickerOpen ? selectedAvatarDisplayId : resolveProfileAvatarId(user?.avatarId, user?.role);
  const headerDesignation = PROFILE_AVATARS.find((avatar) => avatar.id === headerAvatarId)?.displayLabel || user?.role || 'User';
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
        .profile-information-row { min-height: 68px; }
        .profile-information-content { display: block; }
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
        @media (max-width: 639px) {
          .profile-cover-image { object-position: 63% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .profile-tab, .profile-cover-image { transition: none !important; }
        }
      `}</style>

      <div id="profile-redesign" className="profile-redesign w-full">
        <div className="grid min-w-0 grid-cols-1 overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white shadow-[0_5px_18px_rgba(17,17,17,.045)] lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]">
          <section className="profile-identity-visual relative min-h-[300px] overflow-hidden bg-[#f3f3f3] sm:min-h-[380px] lg:min-h-[500px]" aria-label="Industrial facility">
            <img src={profileCover} alt="Industrial facility at sunset" className="profile-cover-image absolute inset-0 block h-full w-full border-0 object-cover outline-none shadow-none" />
          </section>

          <div className="flex min-w-0 flex-col bg-white">
        <header className="flex min-w-0 items-center gap-3 border-b border-[#e8e8e8] px-4 py-4 sm:gap-4 sm:px-5 sm:py-[18px]">
          <button
            type="button"
            onClick={() => {
              setSelectedAvatarId(user?.avatarId || null);
              setAvatarPickerOpen(true);
            }}
            aria-label="Change profile avatar"
            title="Change profile avatar"
            className="group relative h-[62px] w-[62px] shrink-0 rounded-full border border-[#d9d9d9] bg-[#111] text-[20px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87532] sm:h-[68px] sm:w-[68px] sm:text-[22px]"
          >
            <span className="block h-full w-full overflow-hidden rounded-full"><ProfileAvatar avatarId={user?.avatarId} role={user?.role} initials={initials} /></span>
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#222] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true"><Pencil className="h-2.5 w-2.5" /></span>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="!mb-0 truncate !text-[38px] !font-semibold !leading-[1.08] !tracking-[-.035em] !text-[#111] sm:!text-[40px]">{user?.name || 'User'}</h1>
            <p className="mt-1 truncate text-[14px] text-[#62666b] sm:text-[15px]">{headerDesignation} <span className="px-1 text-[#b2b4b7]">|</span> {user?.factoryName || 'Not assigned'}</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="!min-h-9 !shrink-0 !rounded-[7px] !bg-[#111] !px-3 !font-medium !text-white !shadow-none hover:!bg-[#2a2a2a] sm:!px-4"
          >
            {editMode ? 'Cancel edit' : 'Edit Profile'}
          </Button>
        </header>
        <nav className="flex min-w-0 overflow-x-auto border-b border-[#e8e8e8] bg-white px-2" aria-label="Profile sections">
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
                className={`profile-tab relative min-h-[48px] shrink-0 border-b-2 px-3 text-[14px] font-medium sm:px-5 sm:text-[15px] ${selected ? 'border-[#E87532] text-[#111]' : 'border-transparent text-[#73777c] hover:bg-[#fafafa] hover:text-[#222]'}`}
              >
                {label}
              </button>
            );
          })}
          <span className="flex min-h-[48px] shrink-0 cursor-not-allowed items-center border-b-2 border-transparent px-3 text-[14px] font-medium text-[#a1a3a6] sm:px-5 sm:text-[15px]" aria-disabled="true" title="Notifications are not available in this profile yet">Notifications</span>
        </nav>

        <section className="flex min-h-[420px] flex-1 flex-col bg-white px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6" aria-label="Profile details">
          {activeSection === 'profile' && !editMode && activeTab === 'personal' && (
            <div className="profile-information-content">
              <div className="profile-information-grid grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="profile-information-row flex min-w-0 items-center gap-3 rounded-[8px] border border-[#ededed] px-3.5 py-3">
                    <Icon className="h-[17px] w-[17px] shrink-0 text-[#4c5157]" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#73777c]">{label}</p>
                      <p className="mt-0.5 break-words text-[15px] font-medium text-[#202226]">{profileDisplayValue(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && !editMode && activeTab === 'work' && (
            <div className="profile-information-content">
              <div className="profile-information-grid grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  <div key={label} className="profile-information-row flex min-w-0 items-center gap-3 rounded-[8px] border border-[#ededed] px-3.5 py-3">
                    <Icon className="h-[17px] w-[17px] shrink-0 text-[#4c5157]" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#73777c]">{label}</p>
                      <p className="mt-0.5 break-words text-[15px] font-medium text-[#202226]">{profileDisplayValue(value)}</p>
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
      </div>
    </>
  );
};

export default Profile;
