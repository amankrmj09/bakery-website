import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCheckoutState } from '../../cart/redux/cartSlice';
import { paymentApi } from '../api/paymentApi';
import { LuCircleCheck as CheckCircle2, LuCircleAlert as AlertCircle, LuLoader as Loader2, LuCreditCard as CreditCard, LuBanknote as Banknote, LuShieldCheck as ShieldCheck, LuArrowRight as ArrowRight, LuHouse as Home } from 'react-icons/lu';
import { toast } from 'sonner';

export default function PaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const paymentMethod = location.state?.paymentMethod || 'CARD';
  const amount = location.state?.amount || 0;

  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    dispatch(clearCheckoutState());
  }, [dispatch]);

  const handleProcessPayment = async () => {
    setStatus('processing');
    try {
      const payload = {
        orderId,
        userId: user?.id || '00000000-0000-0000-0000-000000000000',
        paymentMethod: paymentMethod,
        paymentGateway: 'MOCK',
        amount: amount > 0 ? amount : 10.00,
        currencyCode: 'USD',
      };
      
      const response = await paymentApi.createPayment(payload);
      const newPaymentId = response.data.id;
      setPaymentId(newPaymentId);
      
      await paymentApi.sendOtp(newPaymentId);
      setStatus('otp');
    } catch (error) {
      console.error('Payment Error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    setStatus('verifying');
    try {
      await paymentApi.verifyOtp(paymentId, otp);
      setStatus('success');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setStatus('otp');
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-5rem)] bg-zinc-50/50 dark:bg-background">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-xl shadow-black/5 p-10 text-center transition-all duration-500 overflow-hidden relative">
        
        {/* Decorative subtle background pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>

        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              {paymentMethod === 'CASH' ? <Banknote className="w-12 h-12 text-primary-500" /> : <CreditCard className="w-12 h-12 text-primary-500" />}
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Complete Payment</h2>
              <p className="text-muted-foreground mt-2 font-medium">Order #{orderId?.slice(0, 8).toUpperCase()}</p>
            </div>
            
            <div className="p-6 bg-background rounded-2xl border-2 border-muted flex justify-between items-center text-xl font-bold text-foreground">
              <span>Total Amount</span>
              <span className="text-primary-600 text-2xl">${amount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleProcessPayment}
              className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary-500/25 flex justify-center items-center gap-2 group"
            >
              {paymentMethod === 'CASH' ? 'Confirm Order' : 'Pay Securely Now'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>256-bit encrypted secure connection</span>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="space-y-8 py-10 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-background border-4 border-primary-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Initiating Payment</h2>
              <p className="text-muted-foreground mt-2">Please do not close or refresh this window.</p>
            </div>
          </div>
        )}

        {(status === 'otp' || status === 'verifying') && (
          <div className="space-y-6 py-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-10 h-10 text-primary-500" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Enter OTP</h2>
              <p className="text-muted-foreground mt-2 font-medium">We've sent a 6-digit code to your email.</p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-mono tracking-[0.5em] h-16 bg-background border-2 border-muted hover:border-border focus:border-primary-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                disabled={status === 'verifying'}
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={status === 'verifying' || otp.length !== 6}
              className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary-500/25 flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === 'verifying' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify & Pay'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8 py-4 animate-in zoom-in-95 duration-500">
            <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
               <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-75"></div>
              <CheckCircle2 className="w-14 h-14 text-green-500 relative z-10" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight text-green-600">Payment Successful!</h2>
              <p className="text-muted-foreground mt-3 font-medium">Your delicious treats are being prepared.</p>
              <div className="mt-4 p-4 bg-muted/50 rounded-xl inline-block border border-border">
                 <p className="text-sm font-semibold">Order ID: <span className="font-mono text-primary-600">{orderId?.slice(0, 8).toUpperCase()}</span></p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 bg-background border-2 border-border text-foreground rounded-xl font-bold text-lg hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                Return to Home
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-8 py-4 animate-in shake duration-500">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Payment Failed</h2>
              <p className="text-red-500 mt-3 font-medium">{errorMessage}</p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStatus('idle')}
                className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 group"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full h-14 mt-3 bg-transparent text-muted-foreground rounded-xl font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                Return to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
