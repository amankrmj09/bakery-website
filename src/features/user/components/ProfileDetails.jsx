import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../auth/redux/authSlice';
import { LuUser as User, LuMail as Mail, LuPhone as Phone, LuLoader as Loader2, LuCircleCheck as CheckCircle2, LuCircleAlert as AlertCircle } from 'react-icons/lu';
import PhoneInputDefault from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = PhoneInputDefault.default || PhoneInputDefault;

export default function ProfileDetails({ user }) {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setProfileData(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await userApi.updateProfile(profileData);
      dispatch(updateUser(profileData));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6">Profile Details</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-8 border-b border-border">
        <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-500 text-3xl font-bold border-2 border-primary-500/20 shadow-sm">
          {profileData?.firstName?.charAt(0) || profileData?.username?.charAt(0) || 'U'}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-foreground">{profileData?.username}</h2>
          <p className="text-muted-foreground">{profileData?.email}</p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-500 border border-primary-500/20 uppercase">
            {profileData?.role}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                name="firstName"
                type="text"
                value={profileData?.firstName || ''}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                name="lastName"
                type="text"
                value={profileData?.lastName || ''}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Phone Number</label>
            <div className="relative">
              <PhoneInput
                country={'us'}
                enableSearch={true}
                value={profileData?.phone || ''}
                onChange={(phone) => setProfileData({ ...profileData, phone: phone ? '+' + phone : '' })}
                containerClass="w-full relative"
                inputClass="!w-full !h-12 !pl-14 !pr-4 !rounded-xl !bg-background !border-2 !border-muted hover:!border-border focus:!border-primary-500 !text-sm focus:!outline-none focus:!ring-4 focus:!ring-primary-500/10 !transition-all !font-medium"
                buttonClass="!border-none !bg-transparent !pl-3 !hover:bg-transparent"
                dropdownClass="!bg-card !border-border !shadow-xl !rounded-xl text-foreground"
                searchClass="!bg-background !border-muted !rounded-lg !p-2 !text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                name="email"
                type="email"
                disabled
                value={profileData?.email || ''}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted border-2 border-border text-sm cursor-not-allowed text-muted-foreground font-medium"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-bold text-foreground mb-6">Security Settings</h3>
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
                  onChange={(e) => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
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
                  onChange={(e) => setProfileData({ ...profileData, loginNotificationsEnabled: e.target.checked })}
                />
                <div className="w-14 h-7 bg-muted-foreground/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-500"></div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-8 mt-8">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50 flex items-center shadow-lg shadow-primary-500/20 transform hover:-translate-y-0.5"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
