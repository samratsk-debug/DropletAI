import React, { useState } from 'react';
import { UserCog, Camera, Eye, EyeOff, CheckCircle2, Shield, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SecurityApiSettings: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [timezone, setTimezone] = useState('UTC');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    currentUser.avatar && !currentUser.avatar.includes('unsplash') ? currentUser.avatar : null
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2FA state

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.id) {
      showToast('Profile editing isn’t available yet. No changes were saved.');
      return;
    }
    setCurrentUser({
      ...currentUser,
      name,
      email,
      department,
      avatar: profilePhoto !== null ? profilePhoto : ''
    });
    showToast('Account profile updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Error: New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Error: New passwords do not match.');
      return;
    }
    showToast('Password changes aren’t available yet. No changes were saved.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your account details and security options.</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Profile Photo & General Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900">General Personal Details</h2>

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gray-100">
          <div className="flex-shrink-0">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-900 shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center text-2xl font-bold shadow">
                {getInitials(name)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-slate-900 block">Profile Avatar</span>
            <p className="text-xs text-slate-500">Add a profile photo or use your initials.</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <label className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition shadow flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Upload Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
              {profilePhoto && (
                <button
                  type="button"
                  onClick={() => setProfilePhoto(null)}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={Boolean(currentUser.id)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={Boolean(currentUser.id)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Job Title / Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={Boolean(currentUser.id)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Workspace Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="IST">IST (Indian Standard Time)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={Boolean(currentUser.id)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow"
            >
              {currentUser.id ? 'Profile editing unavailable' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Credentials */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Security & Credentials</h2>
        </div>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4 pb-6 border-b border-gray-100">
          <p className="rounded-lg border border-amber-800 bg-amber-950 px-3 py-2 text-xs text-amber-200">Password changes aren’t available yet. Submitting will not change your password.</p>
          <span className="text-xs font-bold text-slate-900 block">Change Password</span>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={Boolean(currentUser.id)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow"
            >
              Change password is not available
            </button>
          </div>
        </form>

        {/* 2FA Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
              <span className="text-[11px] text-slate-500">Not available yet</span>
          </div>
          <button
            type="button"
              disabled
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
          >
            Not available
          </button>
        </div>
      </div>
    </div>
  );
};
