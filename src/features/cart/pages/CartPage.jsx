import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { updateCartItem, removeCartItem, updateCartDetails } from '../redux/cartThunk';
import { updateQuantityLocally } from '../redux/cartSlice';
import { LuTrash2 as Trash2, LuPlus as Plus, LuMinus as Minus, LuArrowRight as ArrowRight, LuShoppingBag as ShoppingBag } from 'react-icons/lu';
import { fetchActiveUserOrders, cancelUserOrder } from '../../order/slice/orderSlice';
import OrderCard from '../../order/components/OrderCard';
import CancelOrderModal from '../../user/components/CancelOrderModal';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { activeOrders } = useSelector((state) => state.order);
  
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancelModalState, setCancelModalState] = useState({
    isOpen: false,
    orderId: null,
    loading: false
  });

  const updateTimeouts = useRef({});

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const openCancelModal = (orderId) => {
    setCancelModalState({ isOpen: true, orderId, loading: false });
  };

  const closeCancelModal = () => {
    if (cancelModalState.loading) return;
    setCancelModalState({ isOpen: false, orderId: null, loading: false });
  };

  const confirmCancelOrder = async (reason) => {
    if (!cancelModalState.orderId) return;
    setCancelModalState((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(cancelUserOrder({ orderId: cancelModalState.orderId, reason })).unwrap();
      toast.success("Order cancelled successfully!");
      setCancelModalState({ isOpen: false, orderId: null, loading: false });
    } catch (err) {
      toast.error(err || "Failed to cancel order");
      setCancelModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchActiveUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const item = cart.items.find(i => i.id === itemId);
    const newQty = currentQty + delta;
    if (newQty < 1) {
      if (updateTimeouts.current[itemId]) {
        clearTimeout(updateTimeouts.current[itemId]);
      }
      dispatch(updateQuantityLocally({ itemId, quantity: 0 }));
      dispatch(removeCartItem({ cartId: cart.id, itemId }));
      return;
    }
    
    const maxStock = item?.stockQuantity ?? item?.metadata?.stockLimit;
    if (delta > 0 && maxStock != null && newQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    
    // Update local state instantly so UI doesn't freeze
    dispatch(updateQuantityLocally({ itemId, quantity: newQty }));
    
    // Clear previous timeout if user clicks rapidly
    if (updateTimeouts.current[itemId]) {
      clearTimeout(updateTimeouts.current[itemId]);
    }
    
    // Debounce the backend API call by 1000ms (1 second)
    updateTimeouts.current[itemId] = setTimeout(() => {
      dispatch(updateCartItem({ cartId: cart.id, itemId, quantity: newQty }))
        .unwrap()
        .catch(err => {
           toast.error(err);
        });
    }, 1000);
  };

  const handleRemove = (itemId) => {
    if (updateTimeouts.current[itemId]) {
      clearTimeout(updateTimeouts.current[itemId]);
    }
    dispatch(updateQuantityLocally({ itemId, quantity: 0 }));
    dispatch(removeCartItem({ cartId: cart.id, itemId }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    try {
      await dispatch(updateCartDetails({ cartId: cart.id, cartData: { discountCode: couponCode } })).unwrap();
      toast.success("Coupon applied successfully!");
    } catch (err) {
      toast.error(err || "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setIsApplyingCoupon(true);
    try {
      await dispatch(updateCartDetails({ cartId: cart.id, cartData: { discountCode: ' ' } })).unwrap();
      setCouponCode('');
      toast.success("Coupon removed successfully!");
    } catch (err) {
      toast.error(err || "Failed to remove coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (loading && !cart) {
    return <div className="p-8 text-center text-muted-foreground">Loading cart...</div>;
  }

  const isCartEmpty = !cart || cart.items?.length === 0;

  if (isCartEmpty && (!activeOrders || activeOrders.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] p-8 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any delicious bakery items to your cart yet.</p>
        <div className="flex gap-4">
          <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors">
            Start Shopping
          </Link>
          <Link to="/profile?tab=orders" className="bg-muted text-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted/80 transition-colors border border-border">
            View Order History
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col md:flex-row bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:border-r border-border bg-card custom-scrollbar">
        {activeOrders && activeOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              Active Orders
            </h2>
            <div className="space-y-4">
              {activeOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  expandedOrderId={expandedOrderId}
                  toggleOrderDetails={toggleOrderDetails}
                  openCancelModal={openCancelModal}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Shopping Cart</h2>
          {!isCartEmpty && <span className="text-sm font-medium text-muted-foreground">{cart.totalQuantity} Items</span>}
        </div>

        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Your cart is empty</h3>
            <div className="flex gap-4 mt-2">
              <Link to="/" className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
                Start Shopping
              </Link>
              <Link to="/profile?tab=orders" className="bg-muted text-foreground px-5 py-2.5 rounded-xl font-medium hover:bg-muted/80 transition-colors border border-border">
                Order History
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border bg-background shadow-sm">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {item.productImageUrl ? (
                  <img 
                    src={item.productImageUrl} 
                    alt={item.productName} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                  />
                ) : (
                  <img src="/images/placeholder_bakery.png" alt={item.productName} className="w-full h-full object-cover" />
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                      {item.productName}
                      {item.taxClass && item.taxRate > 0 && (
                        <span className="px-1.5 py-0.5 bg-muted/50 border border-border rounded text-[10px] font-medium text-muted-foreground align-middle">
                          {item.taxClass} ({(item.taxRate * 100).toFixed(0)}%)
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">₹{item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-1 border border-border">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      className="p-1 rounded-md hover:bg-background hover:shadow-sm transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      className="p-1 rounded-md hover:bg-background hover:shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-lg text-foreground">₹{item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {!isCartEmpty && (
        <div className="w-full md:w-96 bg-card p-6 flex flex-col flex-shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-none z-10 overflow-y-auto custom-scrollbar">
          <h3 className="text-lg font-bold text-foreground mb-6 flex-shrink-0">Order Summary</h3>
        
        <div className="space-y-4 text-sm mb-6 flex-1 min-h-[min-content]">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{cart.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {cart.taxAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>₹{cart.taxAmount.toFixed(2)}</span>
            </div>
          )}
          {cart.discountAmount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-₹{cart.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-foreground mt-4">
            <span>Total</span>
            <span>₹{cart.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Discount Code</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)} 
              placeholder="Enter code..." 
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button 
              onClick={handleApplyCoupon}
              disabled={!couponCode || isApplyingCoupon}
              className="inline-flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          {cart.discountCode && cart.discountAmount > 0 && (
             <div className="flex items-center justify-between mt-2 px-1">
               <p className="text-xs font-medium text-green-500">Applied: {cart.discountCode}</p>
               <button 
                 onClick={handleRemoveCoupon}
                 disabled={isApplyingCoupon}
                 className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
               >
                 Remove
               </button>
             </div>
          )}
        </div>

        <button 
          onClick={() => {
            if (!user) {
              toast.error("You must login before checking out");
              navigate('/login');
            } else {
              navigate('/checkout');
            }
          }}
          className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white rounded-xl py-3.5 font-semibold hover:bg-primary-600 transition-colors shadow-sm"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      )}
      <CancelOrderModal
        isOpen={cancelModalState.isOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelOrder}
        orderId={cancelModalState.orderId}
        loading={cancelModalState.loading}
      />
    </div>
  );
}
