import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userApi } from '../api/userApi';
import { User, Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
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
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">My Profile</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-border">
            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center text-primary-500 text-2xl font-bold border border-primary-500/20">
              {profileData?.firstName?.charAt(0) || profileData?.username?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{profileData?.username}</h2>
              <p className="text-muted-foreground">{profileData?.email}</p>
              <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500 border border-primary-500/20 uppercase">
                {profileData?.role}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    name="firstName"
                    type="text"
                    value={profileData?.firstName || ''}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    name="lastName"
                    type="text"
                    value={profileData?.lastName || ''}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    name="phone"
                    type="tel"
                    value={profileData?.phone || ''}
                    onChange={handleChange}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    name="email"
                    type="email"
                    disabled
                    value={profileData?.email || ''}
                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-muted border border-border text-sm cursor-not-allowed text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Default Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                <textarea
                  name="address"
                  value={profileData?.address || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-9 pr-4 py-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 flex items-center"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
