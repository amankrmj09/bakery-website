import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../order/slice/orderSlice';
import { LuPackage as Package, LuLoader as Loader2, LuClock as Clock, LuCheck as CheckCircle2, LuCreditCard as CreditCard, LuX as XCircle, LuChevronRight as ChevronRight, LuChevronDown as ChevronDown, LuMapPin as MapPin } from 'react-icons/lu';
import { format } from 'date-fns';
import ReviewModal from '../../shop/components/ReviewModal';

export default function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);
  const [expandedOrderId, setExpandedOrderId] = React.useState(null);
  const [reviewModalState, setReviewModalState] = React.useState({
    isOpen: false,
    orderId: null,
    productId: null,
    productName: ''
  });

  const openReviewModal = (orderId, productId, productName) => {
    setReviewModalState({ isOpen: true, orderId, productId, productName });
  };

  const closeReviewModal = () => {
    setReviewModalState({ isOpen: false, orderId: null, productId: null, productName: '' });
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

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

  const parseDate = (dateVal) => {
    if (!dateVal) return new Date();
    if (Array.isArray(dateVal)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(dateVal);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order) => {
          let dateObj = parseDate(order.orderDate);
          
          return (
          <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary-500/50 transition-colors group">
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="font-bold text-sm">
                    {dateObj && !isNaN(dateObj.getTime()) ? format(dateObj, 'MMM d, yyyy h:mm a') : 'N/A'}
                  </p>
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
                
                <button 
                  onClick={() => toggleOrderDetails(order.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center bg-background border-2 border-muted hover:border-primary-500 hover:text-primary-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors group-hover:border-primary-500/30"
                >
                  {expandedOrderId === order.id ? 'Hide Details' : 'View Details'} 
                  {expandedOrderId === order.id ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrderId === order.id && (
              <div className="border-t border-border bg-card p-5 md:p-6 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary-500" /> Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                               <img 
                                 src={item.productImageUrl || '/images/placeholder_bakery.png'} 
                                 alt={item.productName} 
                                 className="w-full h-full object-cover mix-blend-multiply" 
                                 onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                               />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{item.productName}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Qty: {item.quantity} × ${(item.unitPrice || 0).toFixed(2)}
                                {item.taxClass && item.taxRate > 0 && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-medium text-muted-foreground">
                                    {item.taxClass} ({(item.taxRate * 100).toFixed(0)}%)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="font-bold text-sm text-foreground">${(item.totalPrice || ((item.unitPrice || 0) * item.quantity)).toFixed(2)}</p>
                            {order.status === 'DELIVERED' && (
                              <button
                                onClick={() => openReviewModal(order.id, item.productId, item.productName)}
                                className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
                              >
                                Write a Review
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-muted/20 p-5 rounded-xl border border-border">
                      <h4 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wider">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span className="font-semibold text-foreground">${(order.totalAmount - (order.taxAmount || 0) - (order.deliveryFee || 0) + (order.discountAmount || 0)).toFixed(2)}</span>
                        </div>
                        {order.taxAmount > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span className="font-semibold text-foreground">${order.taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {order.discountAmount > 0 && (
                          <div className="flex justify-between text-green-500">
                            <span>Discount</span>
                            <span className="font-semibold">-${order.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Delivery Fee</span>
                          <span className="font-semibold text-foreground">{order.deliveryFee > 0 ? `$${order.deliveryFee.toFixed(2)}` : 'Free'}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base text-foreground">
                          <span>Total</span>
                          <span className="text-primary-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{order.deliveryType || 'DELIVERY'}</p>
                          <p className="text-sm font-medium text-foreground">{order.deliveryAddress || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CreditCard className="w-4 h-4 text-primary-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment</p>
                          <p className="text-sm font-medium text-foreground">
                            {order.paymentMethod || 'N/A'} - <span className={`font-bold ${order.paymentStatus === 'COMPLETED' || order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentStatus || 'PENDING'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )})}
      </div>
      
      <ReviewModal 
        isOpen={reviewModalState.isOpen}
        onClose={closeReviewModal}
        orderId={reviewModalState.orderId}
        productId={reviewModalState.productId}
        productName={reviewModalState.productName}
      />
    </div>
  );
}
