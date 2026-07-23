import React, { useState } from 'react';
import { userApi } from '../api/userApi';
import { LuLock as Lock, LuCircleAlert as AlertCircle, LuCircleCheck as CheckCircle2, LuLoader as Loader2, LuMoon as Moon, LuSun as Sun } from 'react-icons/lu';

export default function SettingsPage() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const handleThemeToggle = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>
          <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Theme Appearance</p>
              <p className="text-sm text-muted-foreground">Toggle between Light and Dark Island Theme</p>
            </div>
            <button
              onClick={handleThemeToggle}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-muted border border-border p-1 transition-colors hover:border-primary-500 focus:outline-none"
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
                {isDark ? <Moon className="h-3.5 w-3.5 text-primary-500" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
              </div>
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  name="newPassword"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
