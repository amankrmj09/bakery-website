import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCheckoutState } from '../../cart/redux/cartSlice';
import { markOrderAsPaid } from '../../order/slice/orderSlice';
import { paymentApi } from '../api/paymentApi';
import {
  LuCircleCheck as CheckCircle2,
  LuCircleAlert as AlertCircle,
  LuLoader as Loader2,
  LuCreditCard as CreditCard,
  LuBanknote as Banknote,
  LuShieldCheck as ShieldCheck,
  LuArrowRight as ArrowRight,
  LuHouse as Home,
  LuListOrdered as ListOrdered,
  LuClock as Clock,
} from 'react-icons/lu';
import { toast } from 'sonner';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS  = 60000;

export default function PaymentPage() {
  const { orderId } = useParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();

  const { user }    = useSelector((state) => state.auth);
  const paymentMethod = location.state?.paymentMethod || 'CARD';
  const amount        = location.state?.amount || 0;

  const [status,       setStatus]       = useState('idle');
  const [errorType,    setErrorType]    = useState('generic');
  const [errorMessage, setErrorMessage] = useState('');
  const [otp,          setOtp]          = useState('');
  const [paymentId,    setPaymentId]    = useState(null);
  const [cooldown,     setCooldown]     = useState(30);
  const [resending,    setResending]    = useState(false);

  // Refs to keep intervals/timeouts cleanable
  const pollIntervalRef  = useRef(null);
  const pollTimeoutRef   = useRef(null);

  // OTP resend countdown
  useEffect(() => {
    if (cooldown > 0 && (status === 'otp' || status === 'verifying')) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown, status]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  useEffect(() => {
    dispatch(clearCheckoutState());
  }, [dispatch]);

  // ── Polling helpers ──────────────────────────────────────────────────────────

  const stopPolling = () => {
    if (pollIntervalRef.current)  clearInterval(pollIntervalRef.current);
    if (pollTimeoutRef.current)   clearTimeout(pollTimeoutRef.current);
    pollIntervalRef.current = null;
    pollTimeoutRef.current  = null;
  };

  const startPolling = (pId) => {
    // The actual poll
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res     = await paymentApi.getPaymentById(pId);
        const payment = res.data;

        if (payment.status === 'COMPLETED') {
          stopPolling();
          dispatch(markOrderAsPaid(orderId));
          setStatus('success');
        } else if (payment.status === 'FAILED') {
          stopPolling();
          setErrorType('generic');
          setErrorMessage('Your payment was declined. Please try again with a different method.');
          setStatus('error');
        }
        // PENDING / PROCESSING → keep polling
      } catch {
        // Transient network error — keep polling, timeout will handle the rest
      }
    }, POLL_INTERVAL_MS);

    // Hard timeout after POLL_TIMEOUT_MS
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling();
      setStatus('timeout');
    }, POLL_TIMEOUT_MS);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending || !paymentId) return;
    setResending(true);
    try {
      await paymentApi.resendOtp(paymentId);
      toast.success('A new OTP has been sent!');
      setCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleProcessPayment = async () => {
    setStatus('processing');
    try {
      const payload = {
        orderId,
        userId:          user?.id || '00000000-0000-0000-0000-000000000000',
        paymentMethod,
        paymentGateway:  'MOCK',
        amount:          Number((amount > 0 ? amount : 10.00).toFixed(2)),
        currencyCode:    'INR',
      };

      const response   = await paymentApi.createPayment(payload);
      const newPayId   = response.data.id;
      setPaymentId(newPayId);

      await paymentApi.sendOtp(newPayId);
      setStatus('otp');
    } catch (error) {
      console.error('Payment Error:', error);
      const raw = error.response?.data?.message || '';
      setStatus('error');

      if (raw.toLowerCase().includes('payment already exists') || raw.toLowerCase().includes('already paid')) {
        setErrorType('already_paid');
        setErrorMessage('This order has already been paid. You can view your order status in My Orders.');
      } else if (raw.toLowerCase().includes('order not found')) {
        setErrorType('generic');
        setErrorMessage('We could not find this order. Please contact support if the issue persists.');
      } else if (raw.toLowerCase().includes('cancelled')) {
        setErrorType('generic');
        setErrorMessage('Cannot process payment for a cancelled order.');
      } else {
        setErrorType('generic');
        setErrorMessage('Payment could not be processed. Please try again or contact support.');
      }
    }
  };

  const handleVerifyOtp = async () => {
    setStatus('verifying');
    try {
      await paymentApi.verifyOtp(paymentId, otp);
      // OTP accepted — payment is now processing async via Kafka
      // Switch to confirming state and start polling for COMPLETED
      setStatus('confirming');
      startPolling(paymentId);
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setStatus('otp');
      toast.error('Invalid OTP. Please try again.');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-5rem)] bg-zinc-50/50 dark:bg-background">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-xl shadow-black/5 p-10 text-center transition-all duration-500 overflow-hidden relative">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600" />

        {/* ── IDLE ── */}
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
              <span className="text-primary-600 text-2xl">₹{amount.toFixed(2)}</span>
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

        {/* ── PROCESSING ── */}
        {status === 'processing' && (
          <div className="space-y-8 py-10 animate-in fade-in duration-300">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
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

        {/* ── OTP / VERIFYING ── */}
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
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  disabled={cooldown > 0 || resending}
                  onClick={handleResendOtp}
                  className="font-bold text-primary-600 hover:text-primary-500 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
                >
                  {resending ? 'Resending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── CONFIRMING (polling) ── */}
        {status === 'confirming' && (
          <div className="space-y-8 py-10 animate-in fade-in duration-400">
            {/* Spinner only */}
            <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-primary-500/5 flex items-center justify-center">
                <Clock className="w-10 h-10 text-primary-500" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Confirming Payment</h2>
              <p className="text-muted-foreground mt-2 font-medium">
                Please wait while we verify your payment.<br />
                <span className="text-sm">This usually takes a few seconds.</span>
              </p>
            </div>

            <div className="p-4 bg-muted/40 rounded-xl border border-border w-full">
              <p className="text-sm font-semibold text-muted-foreground">
                Order <span className="font-mono text-primary-600">#{orderId?.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>

            <p className="text-xs text-muted-foreground">Do not close or refresh this window.</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <div className="space-y-8 py-4 animate-in zoom-in-95 duration-500">
            <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-75" />
              <CheckCircle2 className="w-14 h-14 text-green-500 relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-green-600 tracking-tight">Payment Successful!</h2>
              <p className="text-muted-foreground mt-3 font-medium">Your delicious treats are being prepared.</p>
              <div className="mt-4 p-4 bg-muted/50 rounded-xl inline-block border border-border">
                <p className="text-sm font-semibold">Order ID: <span className="font-mono text-primary-600">{orderId?.slice(0, 8).toUpperCase()}</span></p>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                <ListOrdered className="w-5 h-5" /> View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 bg-background border-2 border-border text-foreground rounded-xl font-bold text-lg hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" /> Return to Home
              </button>
            </div>
          </div>
        )}

        {/* ── TIMEOUT ── */}
        {status === 'timeout' && (
          <div className="space-y-8 py-4 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-12 h-12 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Taking Longer Than Expected</h2>
              <p className="text-muted-foreground mt-3 font-medium max-w-sm mx-auto">
                Your payment was submitted but confirmation is delayed. Check your order history in a minute — it will update automatically.
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                <ListOrdered className="w-5 h-5" /> View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 bg-transparent text-muted-foreground rounded-xl font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> Return to Home
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR — Already Paid ── */}
        {status === 'error' && errorType === 'already_paid' && (
          <div className="space-y-8 py-4 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Already Paid</h2>
              <p className="text-muted-foreground mt-3 font-medium max-w-sm mx-auto">{errorMessage}</p>
            </div>
            <div className="pt-2 space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                <ListOrdered className="w-5 h-5" /> View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full h-14 bg-transparent text-muted-foreground rounded-xl font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> Return to Home
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR — Generic ── */}
        {status === 'error' && errorType === 'generic' && (
          <div className="space-y-8 py-4 animate-in shake duration-500">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Payment Failed</h2>
              <p className="text-muted-foreground mt-3 font-medium max-w-sm mx-auto">{errorMessage}</p>
            </div>
            <div className="pt-4 space-y-3">
              <button
                onClick={() => { setStatus('idle'); setErrorType('generic'); }}
                className="w-full h-14 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full h-14 bg-transparent text-muted-foreground rounded-xl font-bold hover:text-foreground transition-colors flex items-center justify-center gap-2"
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
