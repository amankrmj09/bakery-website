import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkoutCart } from '../../cart/redux/cartThunk';
import { LuMapPin as MapPin, LuStore as Store, LuCreditCard as CreditCard, LuBanknote as Banknote, LuLoader as Loader2, LuCircleAlert as AlertCircle, LuArrowRight as ArrowRight, LuShoppingBag as ShoppingBag, LuLock as Lock } from 'react-icons/lu';
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">Looks like you haven't added any delicious treats to your cart yet.</p>
        <button onClick={() => navigate('/')} className="bg-primary-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20">
          Start Shopping
        </button>
      </div>
    );
  }

  const deliveryFee = formData.deliveryType === 'DELIVERY' ? 5.00 : 0;
  const subtotal = cart.totalAmount || 0;
  const finalTotal = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Checkout</h1>

        {checkoutState.error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-500 animate-in fade-in">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{checkoutState.error}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="flex-1 space-y-8">
            {/* Contact Info */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Full Name</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Email Address</label>
                  <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-foreground">Phone Number</label>
                  <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center text-sm">2</span>
                Delivery Method
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, deliveryType: 'DELIVERY'})}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all transform hover:-translate-y-1 ${formData.deliveryType === 'DELIVERY' ? 'border-primary-500 bg-primary-500/5 shadow-md shadow-primary-500/10' : 'border-muted bg-background hover:border-border'}`}
                >
                  {formData.deliveryType === 'DELIVERY' && <div className="absolute top-3 right-3 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />}
                  <MapPin className={`w-8 h-8 mb-3 ${formData.deliveryType === 'DELIVERY' ? 'text-primary-500' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-bold ${formData.deliveryType === 'DELIVERY' ? 'text-primary-600' : 'text-foreground'}`}>Delivery</span>
                  <span className="text-xs text-muted-foreground mt-1">$5.00 fee</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, deliveryType: 'PICKUP'})}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all transform hover:-translate-y-1 ${formData.deliveryType === 'PICKUP' ? 'border-primary-500 bg-primary-500/5 shadow-md shadow-primary-500/10' : 'border-muted bg-background hover:border-border'}`}
                >
                  {formData.deliveryType === 'PICKUP' && <div className="absolute top-3 right-3 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />}
                  <Store className={`w-8 h-8 mb-3 ${formData.deliveryType === 'PICKUP' ? 'text-primary-500' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-bold ${formData.deliveryType === 'PICKUP' ? 'text-primary-600' : 'text-foreground'}`}>Store Pickup</span>
                  <span className="text-xs text-muted-foreground mt-1">Free</span>
                </button>
              </div>
              
              {formData.deliveryType === 'DELIVERY' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <label className="text-sm font-semibold text-foreground">Delivery Address</label>
                  <textarea required name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} rows="3" className="w-full p-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium placeholder:text-muted-foreground/50" placeholder="Enter your full delivery address..."></textarea>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'CARD'})}
                  className={`flex items-center p-5 rounded-xl border-2 transition-all ${formData.paymentMethod === 'CARD' ? 'border-primary-500 bg-primary-500/5 shadow-sm' : 'border-muted bg-background hover:border-border'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'CARD' ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-bold ${formData.paymentMethod === 'CARD' ? 'text-primary-600' : 'text-foreground'}`}>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'CASH'})}
                  className={`flex items-center p-5 rounded-xl border-2 transition-all ${formData.paymentMethod === 'CASH' ? 'border-primary-500 bg-primary-500/5 shadow-sm' : 'border-muted bg-background hover:border-border'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${formData.paymentMethod === 'CASH' ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-bold ${formData.paymentMethod === 'CASH' ? 'text-primary-600' : 'text-foreground'}`}>Cash on Delivery</span>
                </button>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-semibold text-foreground">Special Instructions (Optional)</label>
                <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows="2" className="w-full p-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium placeholder:text-muted-foreground/50" placeholder="Any special requests?"></textarea>
              </div>
            </div>

            {/* Mobile Submit Button (hidden on desktop) */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={checkoutState.loading}
                className="w-full bg-primary-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5"
              >
                {checkoutState.loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                <span>Pay ${finalTotal.toFixed(2)}</span>
                {!checkoutState.loading && <ArrowRight className="w-5 h-5 ml-2" />}
              </button>
            </div>
          </form>

          {/* Right Side - Order Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Delivery Fee</span>
                  <span className="font-semibold">{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-xl font-black text-primary-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 hidden lg:block">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={checkoutState.loading}
                  className="w-full bg-primary-500 text-white p-4 rounded-xl font-bold text-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {checkoutState.loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                  <span>Confirm Order</span>
                  {!checkoutState.loading && <ArrowRight className="w-5 h-5 ml-2" />}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure checkout process
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
