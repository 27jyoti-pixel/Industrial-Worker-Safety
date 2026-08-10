import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import {
  User,
  Mail,
  Building,
  KeyRound,
  BadgeCheck,
  Lock
} from 'lucide-react';
import Card from '../components/common/Card';
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

  return (
    <div className="space-y-6">
      {/* <Breadcrumb items={[{ label: 'User Profile' }]} /> */}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View your logged-in credentials, factory assignment, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="lg:col-span-1" bodyClassName="p-6 text-center">
          <div className="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 border-4 border-orange-100 shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
          <div className="mt-2">
  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
    {user?.role}
  </span>
</div>

{(
  <Button
  variant="outline"
  className="px-3 py-1.5 text-xs mt-3 border-orange-200 text-orange-600 hover:bg-orange-50"
  onClick={() => setEditMode(!editMode)}
>
  {editMode ? 'Cancel Edit' : 'Edit Profile'}
</Button>
)}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-left text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Account
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 font-medium">System Role</span>
              <span className="font-semibold text-slate-800">{user?.role}</span>
            </div>
          </div>
        </Card>

        {/* Profile Details & Password Security */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Organization Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-1">
                  <User className="w-4 h-4 text-orange-600" /> Full Name
                </div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-1">
                  <Mail className="w-4 h-4 text-orange-600" /> Email Address
                </div>
                <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-1">
                  <Building className="w-4 h-4 text-orange-600" /> Factory Unit
                </div>
                <p className="text-sm font-semibold text-slate-800">{user?.factoryName || 'N/A'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 font-medium mb-1">
                  <BadgeCheck className="w-4 h-4 text-orange-600" /> Employee ID
                </div>
                <p className="text-sm font-mono font-semibold text-slate-800">{user?.employeeId || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {editMode && (
  <Card title={`Edit ${user?.role} Profile`}>
    <form onSubmit={handleUpdateProfile} className="space-y-4">

      <Input
        label="Full Name"
        value={profileData.name}
        onChange={(e) =>
          setProfileData({
            ...profileData,
            name: e.target.value
          })
        }
      />

      <Input
        label="Phone"
        value={profileData.phone}
        onChange={(e) =>
          setProfileData({
            ...profileData,
            phone: e.target.value
          })
        }
      />

      {(user?.role === 'Worker' || user?.role === 'Factory Admin') && (
  <Input
    label="Factory Name"
    value={profileData.factoryName}
    onChange={(e) =>
      setProfileData({
        ...profileData,
        factoryName: e.target.value
      })
    }
  />
)}

      {user?.role === 'Worker' && (
  <Input
    label="Employee ID"
    value={profileData.employeeId}
    disabled
  />
)}

      <Button
        type="submit"
        variant="primary"
        loading={loading}
      >
        Save Changes
      </Button>

    </form>
  </Card>
)}

          {/* Password Security */}
          <Card title="Security & Password Change" subtitle="Update account authentication credentials">
            {resetStep === 1 ? (
              <form onSubmit={handleRequestToken} className="space-y-4">
                <Input
                  label="Registered Account Email"
                  type="email"
                  value={passwordEmail}
                  onChange={(e) => setPasswordEmail(e.target.value)}
                  icon={Mail}
                  required
                />
                <Button type="submit" variant="outline" loading={loading} icon={KeyRound}>
                  Request Password Reset Token
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                <div className="flex items-center gap-3">
                  <Button type="submit" variant="primary" loading={loading}>
                    Reset Password
                  </Button>
                  <Button variant="secondary" onClick={() => setResetStep(1)}>
                    Back
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
