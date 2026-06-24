import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCheckoutState } from '../../cart/redux/cartSlice';
import { paymentApi } from '../api/paymentApi';
import { CheckCircle2, AlertCircle, Loader2, CreditCard, Banknote } from 'lucide-react';

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
      
      await paymentApi.createPayment(payload);
      setStatus('success');
    } catch (error) {
      console.error('Payment Error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8 text-center transition-all duration-300">
        
        {status === 'idle' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto">
              {paymentMethod === 'CASH' ? <Banknote className="w-10 h-10 text-primary-500" /> : <CreditCard className="w-10 h-10 text-primary-500" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
              <p className="text-muted-foreground mt-2">Order #{orderId?.slice(0, 8)}</p>
            </div>
            
            <div className="p-4 bg-background rounded-lg border border-border flex justify-between items-center text-lg font-semibold text-foreground">
              <span>Total Amount</span>
              <span>${amount.toFixed(2)}</span>
            </div>

            <button
              onClick={handleProcessPayment}
              className="w-full h-12 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              {paymentMethod === 'CASH' ? 'Confirm Order (Pay on Delivery)' : 'Pay Now'}
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="space-y-6 py-8">
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto" />
            <h2 className="text-xl font-medium text-foreground">Processing Payment...</h2>
            <p className="text-muted-foreground">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground mt-2">Your order has been confirmed.</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in shake">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Payment Failed</h2>
              <p className="text-red-500 mt-2">{errorMessage}</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
