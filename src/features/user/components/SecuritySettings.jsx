import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { LuLoader as Loader2, LuCircleCheck as CheckCircle2, LuCircleAlert as AlertCircle, LuKey as Key } from 'react-icons/lu';

export default function SecuritySettings({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  // Password reset state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load security settings.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggle = async (field, value) => {
    const updatedProfile = { ...profileData, [field]: value };
    setProfileData(updatedProfile);
    try {
      await userApi.updateProfile(updatedProfile);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update setting.' });
      // Revert on error
      setProfileData(profileData);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setSavingPassword(true);
    try {
      await userApi.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-6">Security Settings</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-center justify-between p-5 border-2 border-border rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-muted/30 transition-all">
            <div>
              <div className="font-bold text-foreground">Two-Factor Authentication (2FA)</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Require a one-time passcode (OTP) when logging in to your account.</div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                className="sr-only peer"
                name="twoFactorEnabled"
                checked={profileData?.twoFactorEnabled !== false}
                onChange={(e) => handleToggle('twoFactorEnabled', e.target.checked)}
              />
              <div className="w-14 h-7 bg-muted-foreground/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-500"></div>
            </div>
          </label>

          <label className="flex items-center justify-between p-5 border-2 border-border rounded-2xl cursor-pointer hover:border-primary-500/50 hover:bg-muted/30 transition-all">
            <div>
              <div className="font-bold text-foreground">Login Notifications</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Receive an email alert whenever a new sign-in is detected.</div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                className="sr-only peer"
                name="loginNotificationsEnabled"
                checked={profileData?.loginNotificationsEnabled !== false}
                onChange={(e) => handleToggle('loginNotificationsEnabled', e.target.checked)}
              />
              <div className="w-14 h-7 bg-muted-foreground/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-500"></div>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-6">Change Password</h2>

        {passwordMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border ${passwordMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {passwordMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Current Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                name="currentPassword"
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">New Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="newPassword"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50 flex items-center shadow-lg shadow-primary-500/20 transform hover:-translate-y-0.5"
            >
              {savingPassword ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
