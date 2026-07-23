import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../order/slice/orderSlice';
import { LuPackage as Package, LuLoader as Loader2, LuClock as Clock, LuCheck as CheckCircle2, LuCreditCard as CreditCard, LuX as XCircle, LuChevronRight as ChevronRight } from 'react-icons/lu';
import { format } from 'date-fns';

export default function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  if (loading && orders.length === 0) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">Looks like you haven't made any purchases yet.</p>
        <button onClick={() => navigate('/shop')} className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20">
          Start Shopping
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'PROCESSING':
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 mr-1.5" />;
      default: return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };
  
  const getTimelineProgress = (status) => {
    switch(status) {
      case 'PENDING': return 25;
      case 'CONFIRMED': return 50;
      case 'PROCESSING': return 75;
      case 'COMPLETED':
      case 'DELIVERED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary-500/50 transition-colors group">
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="font-bold text-sm">{format(new Date(order.orderDate), 'MMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="font-bold text-sm">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order #</p>
                  <p className="font-bold text-sm font-mono">{order.orderNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
            </div>

            {/* Timeline for active orders */}
            {order.status !== 'CANCELLED' && (
              <div className="px-5 md:px-6 pt-6 pb-2">
                 <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-1000 ease-in-out"
                      style={{ width: `${getTimelineProgress(order.status)}%` }}
                    />
                 </div>
                 <div className="flex justify-between text-[10px] sm:text-xs font-bold text-muted-foreground mt-2 uppercase tracking-wider">
                    <span className={getTimelineProgress(order.status) >= 25 ? 'text-primary-600' : ''}>Pending</span>
                    <span className={getTimelineProgress(order.status) >= 50 ? 'text-primary-600' : ''}>Confirmed</span>
                    <span className={getTimelineProgress(order.status) >= 75 ? 'text-primary-600' : ''}>Processing</span>
                    <span className={getTimelineProgress(order.status) >= 100 ? 'text-primary-600' : ''}>Delivered</span>
                 </div>
              </div>
            )}

            {/* Body */}
            <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bold">{order.items?.length || 0} items</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {order.items?.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Pay Now button for COD or Unpaid orders */}
                {(order.paymentStatus === 'PENDING' || order.paymentMethod === 'CASH') && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && order.status !== 'COMPLETED' && (
                  <button 
                    onClick={() => navigate(`/payment/${order.id}`, { state: { amount: order.totalAmount, paymentMethod: 'CARD' } })}
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                  </button>
                )}
                
                <button className="flex-1 sm:flex-none flex items-center justify-center bg-background border-2 border-muted hover:border-primary-500 hover:text-primary-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors group-hover:border-primary-500/30">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
