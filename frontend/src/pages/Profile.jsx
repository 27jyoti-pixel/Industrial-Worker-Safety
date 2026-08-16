import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

import {
  User,
  Mail,
  Building,
  KeyRound,
  BadgeCheck,
  Lock,
  Phone,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  BriefcaseBusiness,
  Home
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Breadcrumb from '../components/common/Breadcrumb';

const Profile = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [passwordEmail, setPasswordEmail] = useState(user?.email || '');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    factoryName: user?.factoryName || '',
    employeeId: user?.employeeId || ''
  });

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      phone: user?.phone || '',
      factoryName: user?.factoryName || '',
      employeeId: user?.employeeId || ''
    });

    setPasswordEmail(user?.email || '');
  }, [user]);

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

      await authService.updateProfile(profileData);

      showSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);

    if (section === 'profile') {
      setEditMode(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <>
      <style>{`
        .profile-page-enter {
          animation: profileFadeIn 420ms ease-out both;
        }

        .profile-shell {
          animation: profileSlideUp 520ms cubic-bezier(.22,1,.36,1) 40ms both;
        }

        .profile-hero-card {
          background:
            radial-gradient(circle at 92% 18%, rgba(255,255,255,.12) 0 70px, transparent 71px),
            radial-gradient(circle at 84% 92%, rgba(255,255,255,.07) 0 110px, transparent 111px),
            linear-gradient(135deg, #3E5C54 0%, #496A61 100%);
          transition: box-shadow 220ms ease, transform 220ms ease;
        }

        .profile-hero-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 42px rgba(62,92,84,.16);
        }

        .profile-avatar {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }

        .profile-avatar:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 24px rgba(62,92,84,.16);
        }

        .profile-nav-item {
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
        }

        .profile-nav-item:hover {
          transform: translateX(2px);
        }

        .profile-detail-item {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .profile-detail-item:hover {
          transform: translateY(-2px);
          border-color: #B9C9C3;
          box-shadow: 0 10px 24px rgba(62,92,84,.07);
        }

        .profile-security-card {
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .profile-security-card:hover {
          border-color: #B9C9C3;
          box-shadow: 0 10px 24px rgba(62,92,84,.06);
        }

        .profile-page-enter button,
        .profile-page-enter input {
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .profile-page-enter button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .profile-page-enter button:active:not(:disabled) {
          transform: translateY(0);
        }

        @keyframes profileFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes profileSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .profile-page-enter,
          .profile-shell {
            animation: none !important;
          }

          .profile-hero-card,
          .profile-avatar,
          .profile-nav-item,
          .profile-detail-item,
          .profile-security-card,
          .profile-page-enter button,
          .profile-page-enter input {
            transition: none !important;
          }

          .profile-hero-card:hover,
          .profile-avatar:hover,
          .profile-nav-item:hover,
          .profile-detail-item:hover,
          .profile-page-enter button:hover:not(:disabled) {
            transform: none !important;
          }
        }
      `}</style>

      <div className="space-y-5 profile-page-enter">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm">
          {/* <Home className="w-4 h-4 text-[#6C757D]" /> */}

          <NavLink
            to="/dashboard"
            className="text-[#6C757D] hover:text-[#3E5C54] transition-colors duration-200"
          >
            Dashboard
          </NavLink>

          <span className="text-[#D0D0D0] text-base leading-none">/</span>

          <span className="font-medium text-[#3E5C54]">
            Profile
          </span>
        </div>

        {/* COMPACT PROFILE HERO */}
        <section className="profile-hero-card relative overflow-hidden rounded-[24px] text-white shadow-[0_12px_30px_rgba(62,92,84,.12)]">
          <div className="relative px-5 sm:px-7 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="profile-avatar relative w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] rounded-[22px] bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-2xl sm:text-3xl font-semibold">
                    {initials}
                  </span>
                  <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/65">
                      Account profile
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E9C46A]" />
                  </div>

                  <h1 className="text-[27px] sm:text-[34px] font-semibold tracking-[-.03em] leading-tight truncate">
                    {user?.name || 'User'}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-white/75">
                    <span>{user?.factoryName || 'Industrial Safety'}</span>
                    <span className="hidden sm:inline text-white/35">•</span>
                    <span>{user?.role || 'User'}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                icon={Pencil}
                onClick={() => setEditMode(!editMode)}
                className="!bg-white !border-white !text-[#3E5C54] hover:!bg-[#F4F4F4] shrink-0"
              >
                {editMode ? 'Cancel edit' : 'Edit profile'}
              </Button>
            </div>
          </div>
        </section>

        {/* MAIN PROFILE WORKSPACE */}
        <section className="profile-shell overflow-hidden rounded-[24px] border border-[#E0E0E0] bg-white shadow-[0_10px_30px_rgba(24,35,29,.045)]">
      
          

          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
            {/* LEFT NAVIGATION */}
            <aside className="border-b lg:border-b-0 lg:border-r border-[#E0E0E0] bg-[#F7F8F6] p-5">
              <div className="rounded-[18px] border border-[#E0E0E0] bg-white p-4 shadow-[0_5px_16px_rgba(24,35,29,.025)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[15px] bg-[#3E5C54] text-white flex items-center justify-center font-semibold shrink-0">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-[#1E1E1E] truncate">
                      {user?.name || 'User'}
                    </h2>
                    <p className="text-xs text-[#6C757D] mt-0.5 truncate">
                      {user?.factoryName || 'Industrial Safety'}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-[#3E5C54] bg-[#E9C46A] rounded-full px-2 py-1">
                      <ShieldCheck className="w-3 h-3" />
                      {user?.role || 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="px-2 mb-2 text-[10px] uppercase tracking-[.16em] font-semibold text-[#6C757D]">
                  Account
                </p>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSectionChange('profile')}
                    className={`profile-nav-item w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm border ${
                      activeSection === 'profile'
                        ? 'bg-[#EEF2F0] border-[#B9C9C3] text-[#3E5C54]'
                        : 'text-[#6C757D] hover:bg-white border-transparent'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Profile information</span>
                    {activeSection === 'profile' && (
                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#2A9D8F]" />
                    )}
                  </button>

                  <div className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm text-[#6C757D]">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                    <span className="ml-auto text-[11px]">Verified</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSectionChange('password')}
                    className={`profile-nav-item w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm border ${
                      activeSection === 'password'
                        ? 'bg-[#EEF2F0] border-[#B9C9C3] text-[#3E5C54]'
                        : 'text-[#6C757D] hover:bg-white border-transparent'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Password reset</span>
                    {activeSection === 'password' && (
                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#2A9D8F]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="hidden lg:block mt-6 rounded-[18px] border border-[#E0E0E0] bg-[#EEF2F0] p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#B9C9C3] text-[#3E5C54] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#3E5C54]">
                      Account protected
                    </p>
                    <p className="text-[11px] leading-4 text-[#6C757D] mt-1">
                      Your profile and security settings are managed from this workspace.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="p-5 sm:p-7 lg:p-8">
              {activeSection === 'profile' && !editMode && (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[.16em] font-semibold text-[#6C757D]">
                        Profile information
                      </div>
                      <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#1E1E1E] mt-1 tracking-tight">
                        Your account details
                      </h2>
                      <p className="text-sm text-[#6C757D] mt-1">
                        Information connected to your industrial safety account.
                      </p>
                    </div>

                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#EEF2F0] border border-[#B9C9C3] items-center justify-center text-[#3E5C54]">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="profile-detail-item rounded-[16px] border border-[#E0E0E0] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                        <User className="w-4 h-4 text-[#3E5C54]" />
                        Full name
                      </div>
                      <p className="text-base font-semibold text-[#3E5C54] mt-3">
                        {user?.name}
                      </p>
                    </div>

                    <div className="profile-detail-item rounded-[16px] border border-[#E0E0E0] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                        <Mail className="w-4 h-4 text-[#3E5C54]" />
                        Email address
                      </div>
                      <p className="text-base font-semibold text-[#3E5C54] mt-3 break-all">
                        {user?.email}
                      </p>
                    </div>

                    <div className="profile-detail-item rounded-[16px] border border-[#E0E0E0] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                        <Building className="w-4 h-4 text-[#3E5C54]" />
                        Factory unit
                      </div>
                      <p className="text-base font-semibold text-[#3E5C54] mt-3">
                        {user?.factoryName || 'Not assigned'}
                      </p>
                    </div>

                    <div className="profile-detail-item rounded-[16px] border border-[#E0E0E0] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                        <BadgeCheck className="w-4 h-4 text-[#3E5C54]" />
                        Employee ID
                      </div>
                      <p className="text-base font-semibold font-mono text-[#3E5C54] mt-3">
                        {user?.employeeId || 'Not assigned'}
                      </p>
                    </div>

                    <div className="profile-detail-item sm:col-span-2 rounded-[16px] border border-[#E0E0E0] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                        <Phone className="w-4 h-4 text-[#3E5C54]" />
                        Phone
                      </div>
                      <p className="text-base font-semibold text-[#3E5C54] mt-3">
                        {user?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'profile' && editMode && (
                <div>
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[.16em] font-semibold text-[#6C757D]">
                      Profile information
                    </div>
                    <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#1E1E1E] mt-1 tracking-tight">
                      Edit your details
                    </h2>
                    <p className="text-sm text-[#6C757D] mt-1">
                      Update the information connected to your account.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />

                    <Input
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />

                    {(user?.role === 'Worker' || user?.role === 'Factory Admin') && (
                      <Input
                        label="Factory Name"
                        value={profileData.factoryName}
                        onChange={(e) => setProfileData({ ...profileData, factoryName: e.target.value })}
                      />
                    )}

                    {user?.role === 'Worker' && (
                      <Input label="Employee ID" value={profileData.employeeId} disabled />
                    )}

                    <div className="sm:col-span-2 flex justify-end gap-3 pt-3">
                      <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" loading={loading}>
                        Save changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeSection === 'password' && (
                <div>
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[.16em] font-semibold text-[#6C757D]">
                      Account security
                    </div>
                    <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#1E1E1E] mt-1 tracking-tight">
                      Password reset
                    </h2>
                    <p className="text-sm text-[#6C757D] mt-1">
                      Securely reset the password connected to your account.
                    </p>
                  </div>

                  {resetStep === 1 ? (
                    <form onSubmit={handleRequestToken} className="max-w-2xl">
                      <div className="profile-security-card rounded-[18px] border border-[#E0E0E0] bg-[#F7F8F6] p-5 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-[#E0E0E0] flex items-center justify-center text-[#3E5C54] shrink-0">
                            <KeyRound className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[#3E5C54]">
                              Request a reset token
                            </h3>
                            <p className="text-xs text-[#6C757D] mt-1 leading-5">
                              A secure reset token will be sent to your registered account email.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Input
                        label="Registered Account Email"
                        type="email"
                        value={passwordEmail}
                        onChange={(e) => setPasswordEmail(e.target.value)}
                        icon={Mail}
                        required
                      />

                      <div className="mt-5">
                        <Button type="submit" variant="primary" loading={loading} icon={KeyRound}>
                          Request reset token
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="max-w-2xl space-y-5">
                      <Input
                        label="Password Reset Token"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Paste token received"
                        required
                      />

                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        icon={Lock}
                        required
                      />

                      <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" variant="primary" loading={loading}>
                          Reset password
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setResetStep(1)}>
                          Back
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </main>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;