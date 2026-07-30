import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../redux/authThunk';
import { clearError } from '../redux/authSlice';
import { LuKey as Key, LuLock as Lock, LuCircleAlert as AlertCircle, LuLoader as Loader2, LuArrowLeft as ArrowLeft } from 'react-icons/lu';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!formData.email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [formData.email, navigate]);

  const handleChange = (e) => {
    dispatch(clearError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const resultAction = await dispatch(resetPassword({
      email: formData.email,
      otp: formData.otp,
      newPassword: formData.newPassword
    }));
    
    if (resetPassword.fulfilled.match(resultAction)) {
      toast.success('Password successfully reset');
      navigate('/login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:w-1/2 flex-none relative z-10 bg-white flex flex-col h-screen shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]"
    >
      <div className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50">
        <button 
          onClick={() => navigate('/login')} 
          className="p-2 pr-4 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all group flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </button>
      </div>

      <div data-lenis-prevent="true" className="flex-1 w-full min-h-0 overflow-y-auto">
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pt-16 lg:p-12 lg:pt-20">
          <div className="w-full max-w-md relative z-20 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl mb-12">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mb-6 ring-1 ring-primary-100 shadow-sm">
                <Key className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2 font-outfit">Create New Password</h1>
              <p className="text-zinc-500">Please enter the recovery code sent to {formData.email}</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase">Recovery Code (OTP)</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-400 font-medium tracking-widest uppercase"
                    placeholder="Enter OTP"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    name="newPassword"
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-400 font-medium"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-400 font-medium"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.otp.trim() || !formData.newPassword.trim()}
                className="w-full h-14 mt-6 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center shadow-lg shadow-primary-600/20"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
