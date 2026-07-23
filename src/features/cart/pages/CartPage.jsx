import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { updateCartItem, removeCartItem } from '../redux/cartThunk';
import { LuTrash2 as Trash2, LuPlus as Plus, LuMinus as Minus, LuArrowRight as ArrowRight, LuShoppingBag as ShoppingBag } from 'react-icons/lu';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    dispatch(updateCartItem({ cartId: cart.id, itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem({ cartId: cart.id, itemId }));
  };

  if (loading && !cart) {
    return <div className="p-8 text-center text-muted-foreground">Loading cart...</div>;
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any delicious bakery items to your cart yet.</p>
        <Link to="/" className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-6 md:border-r border-border bg-card">
        <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Shopping Cart</h2>
          <span className="text-sm font-medium text-muted-foreground">{cart.totalQuantity} Items</span>
        </div>

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
                    <h3 className="font-semibold text-foreground text-lg">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)} each</p>
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
                  <span className="font-bold text-lg text-foreground">${item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-96 bg-card p-6 flex flex-col flex-shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-none z-10">
        <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>
        
        <div className="space-y-4 text-sm mb-6 flex-1">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${cart.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          {cart.taxAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>${cart.taxAmount.toFixed(2)}</span>
            </div>
          )}
          {cart.discountAmount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-${cart.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-4 text-base font-bold text-foreground mt-4">
            <span>Total</span>
            <span>${cart.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
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
    </div>
  );
}
