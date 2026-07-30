import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../redux/authThunk';
import { clearError } from '../redux/authSlice';
import { LuLock as Lock, LuMail as Mail, LuCircleAlert as AlertCircle, LuLoader as Loader2, LuArrowLeft as ArrowLeft } from 'react-icons/lu';
import { toast } from 'sonner';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    dispatch(clearError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      if (resultAction.payload.requiresOtp === false) {
        toast.success('Successfully logged in');
        navigate(from, { replace: true });
      } else {
        toast.success('Please check your email for the OTP');
        // Pass the 'from' path and 'usernameOrEmail' in state so OtpPage knows where to go after verifying and has the required param
        navigate('/verify-otp', { state: { from: location.state?.from, usernameOrEmail: formData.usernameOrEmail } });
      }
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
          onClick={() => navigate('/')} 
          className="p-2 pr-4 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all group flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back home
        </button>
      </div>

      <div data-lenis-prevent="true" className="flex-1 w-full min-h-0 overflow-y-auto">
        <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pt-16 lg:p-12 lg:pt-20">
          <div className="w-full max-w-md relative z-20 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl mb-12">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mb-6 ring-1 ring-primary-100 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2 font-outfit">Welcome Back</h1>
            <p className="text-zinc-500">Log in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  name="usernameOrEmail"
                  type="text"
                  required
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-400 font-medium"
                  placeholder="Enter your email or username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-zinc-400 font-medium"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-6 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center shadow-lg shadow-primary-600/20"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-bold transition-colors hover:underline underline-offset-4">
              Create an account
            </Link>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
