import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkoutCart } from '../../cart/redux/cartThunk';
import { MapPin, Store, CreditCard, Banknote, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, checkoutState } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    deliveryType: 'DELIVERY',
    deliveryAddress: user?.address || '',
    paymentMethod: 'CARD', 
    specialInstructions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart?.id) return;

    const resultAction = await dispatch(checkoutCart({ cartId: cart.id, checkoutData: formData }));
    if (checkoutCart.fulfilled.match(resultAction)) {
      toast.success('Order placed successfully!');
      const order = resultAction.payload.order;
      navigate(`/payment/${order.id}`, { state: { paymentMethod: formData.paymentMethod, amount: order.totalAmount } });
    } else {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-500 hover:underline">Go back to shopping</button>
      </div>
    );
  }

  const deliveryFee = formData.deliveryType === 'DELIVERY' ? 5.00 : 0;
  const finalTotal = (cart.totalAmount || 0) + deliveryFee;

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">Checkout</h1>

        {checkoutState.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-500">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{checkoutState.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary-500/50 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary-500/50 outline-none" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary-500/50 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, deliveryType: 'DELIVERY'})}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.deliveryType === 'DELIVERY' ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-background hover:bg-muted/50'}`}
              >
                <MapPin className={`w-6 h-6 mb-2 ${formData.deliveryType === 'DELIVERY' ? 'text-primary-500' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${formData.deliveryType === 'DELIVERY' ? 'text-primary-500' : 'text-foreground'}`}>Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, deliveryType: 'PICKUP'})}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.deliveryType === 'PICKUP' ? 'border-primary-500 bg-primary-500/5' : 'border-border bg-background hover:bg-muted/50'}`}
              >
                <Store className={`w-6 h-6 mb-2 ${formData.deliveryType === 'PICKUP' ? 'text-primary-500' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${formData.deliveryType === 'PICKUP' ? 'text-primary-500' : 'text-foreground'}`}>Store Pickup</span>
              </button>
            </div>
            
            {formData.deliveryType === 'DELIVERY' && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2">
                <label className="text-sm font-medium text-foreground">Delivery Address</label>
                <textarea required name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} rows="3" className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary-500/50 outline-none resize-none"></textarea>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'CARD'})}
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === 'CARD' ? 'border-primary-500 bg-primary-500/5 text-primary-500' : 'border-border bg-background text-foreground hover:bg-muted/50'}`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'CASH'})}
                className={`flex items-center p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === 'CASH' ? 'border-primary-500 bg-primary-500/5 text-primary-500' : 'border-border bg-background text-foreground hover:bg-muted/50'}`}
              >
                <Banknote className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Cash</span>
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <label className="text-sm font-semibold text-foreground mb-2 block">Special Instructions (Optional)</label>
            <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows="2" className="w-full p-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary-500/50 outline-none resize-none"></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={checkoutState.loading}
              className="bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 flex items-center"
            >
              {checkoutState.loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              <span>Place Order • ${finalTotal.toFixed(2)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
