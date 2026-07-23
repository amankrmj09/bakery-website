import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyLogin, verifyRegister } from '../redux/authThunk';
import { clearError, clearOtpState } from '../redux/authSlice';
import { LuKey as Key, LuCircleAlert as AlertCircle, LuLoader as Loader2, LuArrowLeft as ArrowLeft } from 'react-icons/lu';
import { toast } from 'sonner';

export default function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isOtpPending, pendingEmail, authType } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState('');

  // Redirect to home if accessed without pending OTP
  useEffect(() => {
    if (!isOtpPending || !pendingEmail) {
      navigate('/', { replace: true });
    }
  }, [isOtpPending, pendingEmail, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    dispatch(clearError());
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    const payload = authType === 'login'
      ? {
          usernameOrEmail: location.state?.usernameOrEmail || pendingEmail,
          otp: otp
        }
      : {
          email: pendingEmail,
          otp: otp
        };

    let resultAction;
    if (authType === 'login') {
      resultAction = await dispatch(verifyLogin(payload));
    } else {
      resultAction = await dispatch(verifyRegister(payload));
    }

    if (verifyLogin.fulfilled.match(resultAction) || verifyRegister.fulfilled.match(resultAction)) {
      toast.success(authType === 'login' ? 'Successfully logged in!' : 'Registration verified!');
      navigate(from, { replace: true });
    }
  };

  const handleCancel = () => {
    dispatch(clearOtpState());
    navigate(authType === 'login' ? '/login' : '/register', { replace: true });
  };

  if (!isOtpPending) return null;

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden relative w-full">
      {/* Dynamic Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Left side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-100 overflow-hidden z-10 shadow-2xl">
        <img 
          src="/images/auth-bg.png" 
          alt="Artisan bakery pastries" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[20s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/60 via-zinc-900/20 to-transparent pointer-events-none" />
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <div className="w-16 h-1 bg-primary-500 mb-6 rounded-full" />
          <h2 className="text-5xl font-bold mb-6 tracking-tight font-outfit leading-tight">Secure <br/><span className="text-primary-300">Authentication</span></h2>
          <p className="text-xl text-zinc-100 max-w-md font-light leading-relaxed">Please verify your identity to access the delicious world of Blu's Bakery.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 relative z-10 bg-white flex flex-col h-full shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="min-h-full flex flex-col items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md flex justify-start mb-6 mt-4">
              <button 
                onClick={handleCancel} 
                className="p-2 pr-4 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all group flex items-center gap-2 text-sm font-medium z-20 w-fit"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </button>
            </div>

            <div className="w-full max-w-md relative z-20 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl mb-12">
              <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mb-6 ring-1 ring-primary-100 shadow-sm">
                  <Key className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2 font-outfit">
                  {authType === 'login' ? 'Verify Login' : 'Verify Email'}
                </h1>
                <p className="text-zinc-500 text-sm">
                  We've sent a one-time password to <br />
                  <span className="font-bold text-zinc-700">{pendingEmail}</span>
                </p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold tracking-wider text-zinc-600 uppercase text-center block mb-4">Enter OTP Code</label>
                  <div className="relative">
                    <input
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={handleChange}
                      className="w-full h-14 text-center text-2xl tracking-[0.5em] rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-primary-500 text-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold"
                      placeholder="------"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 mt-6 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center shadow-lg shadow-primary-600/20"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Verify & Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
