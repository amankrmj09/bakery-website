import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders, cancelUserOrder } from '../../order/slice/orderSlice';
import { LuPackage as Package, LuLoader as Loader2, LuClock as Clock, LuCheck as CheckCircle2, LuCreditCard as CreditCard, LuX as XCircle, LuChevronRight as ChevronRight, LuChevronLeft as ChevronLeft, LuChevronDown as ChevronDown, LuMapPin as MapPin } from 'react-icons/lu';
import { format } from 'date-fns';
import ReviewModal from '../../shop/components/ReviewModal';
import CancelOrderModal from './CancelOrderModal';
import { toast } from 'sonner';
import { YearSelector, YearMonthSelector, StatusSelector, TimeModeSelector } from './TimeFilterControls';

export default function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, pagination, isFiltered } = useSelector((state) => state.order);
  const { reviews } = useSelector((state) => state.shop);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [timeFilterMode, setTimeFilterMode] = React.useState('ALL');
  const [yearInput, setYearInput] = React.useState(String(new Date().getFullYear()));
  const [monthInput, setMonthInput] = React.useState(new Date().toISOString().slice(0, 7));
  const [expandedOrderId, setExpandedOrderId] = React.useState(null);
  const [reviewModalState, setReviewModalState] = React.useState({
    isOpen: false,
    orderId: null,
    productId: null,
    productName: '',
    existingReview: null
  });
  const [cancelModalState, setCancelModalState] = React.useState({
    isOpen: false,
    orderId: null,
    loading: false
  });

  const openReviewModal = (orderId, productId, productName, existingReview) => {
    setReviewModalState({ isOpen: true, orderId, productId, productName, existingReview });
  };

  const closeReviewModal = () => {
    setReviewModalState({ isOpen: false, orderId: null, productId: null, productName: '', existingReview: null });
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const isFilterActive = statusFilter !== 'ALL' || timeFilterMode !== 'ALL';

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders({
        userId: user.id,
        page: currentPage,
        size: pageSize,
        isFiltered: isFilterActive
      }));
    }
  }, [dispatch, user?.id, currentPage, pageSize, isFilterActive]);

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

  const parseDate = (dateVal) => {
    if (!dateVal) return new Date();
    if (Array.isArray(dateVal)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(dateVal);
  };

  const getOrderYearAndMonth = (dateVal) => {
    const d = parseDate(dateVal);
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return { year, yearMonth: `${year}-${month}` };
  };

  const matchingOrders = React.useMemo(() => {
    if (!isFilterActive) return orders;
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }
      if (timeFilterMode === 'YEAR' && yearInput) {
        const { year } = getOrderYearAndMonth(order.orderDate);
        if (year !== String(yearInput).trim()) {
          return false;
        }
      } else if (timeFilterMode === 'MONTH' && monthInput) {
        const { yearMonth } = getOrderYearAndMonth(order.orderDate);
        if (yearMonth !== String(monthInput).trim()) {
          return false;
        }
      }
      return true;
    });
  }, [orders, isFilterActive, statusFilter, timeFilterMode, yearInput, monthInput]);

  const displayOrders = isFilterActive
    ? matchingOrders.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : orders;

  const effectivePagination = isFilterActive ? {
    number: currentPage,
    size: pageSize,
    totalElements: matchingOrders.length,
    totalPages: Math.ceil(matchingOrders.length / pageSize) || 1
  } : pagination;

  const hasNoOrdersAtAll = orders.length === 0 && !isFilterActive;

  if (loading && orders.length === 0) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  if (hasNoOrdersAtAll) {
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
      case 'DELIVERED': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'OUT_FOR_DELIVERY': return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'PREPARING':
      case 'READY':
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 mr-1.5" />;
      default: return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };
  
  const getTimelineProgress = (status) => {
    switch(status) {
      case 'PENDING': return 25;
      case 'CONFIRMED': return 50;
      case 'PREPARING': return 65;
      case 'READY': return 75;
      case 'OUT_FOR_DELIVERY': return 85;
      case 'DELIVERED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h2 className="text-xl font-bold text-foreground">Order History</h2>
        
        {/* Pagination Controls at Top */}
        {effectivePagination && (effectivePagination.totalPages > 1 || effectivePagination.totalElements > 5 || matchingOrders.length > 0) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Page <strong className="text-foreground">{effectivePagination.number + 1}</strong> of <strong className="text-foreground">{effectivePagination.totalPages || 1}</strong></span>
              <span>({effectivePagination.totalElements || matchingOrders.length})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 border-l border-border pl-3">
                <label htmlFor="pageSizeTop" className="text-xs font-semibold text-muted-foreground">Show:</label>
                <select
                  id="pageSizeTop"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-border pl-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={effectivePagination.number === 0 || loading}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {(() => {
                  const total = effectivePagination.totalPages || 1;
                  const current = effectivePagination.number || 0;
                  let pages = [];
                  if (total <= 5) {
                    pages = Array.from({ length: total }, (_, i) => i);
                  } else {
                    if (current <= 2) pages = [0, 1, 2, 3, total - 1];
                    else if (current >= total - 3) pages = [0, total - 4, total - 3, total - 2, total - 1];
                    else pages = [0, current - 1, current, current + 1, total - 1];
                  }
                  return pages.map((pageIdx, idx) => {
                    if (idx > 0 && pageIdx - pages[idx - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-top-${pageIdx}`}>
                          <span className="px-1 text-xs text-muted-foreground">...</span>
                          <button
                            onClick={() => setCurrentPage(pageIdx)}
                            disabled={loading}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                              current === pageIdx
                                ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                : 'border border-border bg-background hover:bg-muted text-foreground'
                            }`}
                          >
                            {pageIdx + 1}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={pageIdx}
                        onClick={() => setCurrentPage(pageIdx)}
                        disabled={loading}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                          current === pageIdx
                            ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                            : 'border border-border bg-background hover:bg-muted text-foreground'
                        }`}
                      >
                        {pageIdx + 1}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min((effectivePagination.totalPages || 1) - 1, prev + 1))}
                  disabled={effectivePagination.number >= ((effectivePagination.totalPages || 1) - 1) || loading || effectivePagination.totalPages === 0}
                  className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
            <StatusSelector
              selectedStatus={statusFilter}
              onChange={(status) => {
                setStatusFilter(status);
                setCurrentPage(0);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time:</span>
            <TimeModeSelector
              selectedMode={timeFilterMode}
              onChange={(mode) => {
                setTimeFilterMode(mode);
                setCurrentPage(0);
              }}
            />

            {timeFilterMode === 'YEAR' && (
              <YearSelector
                selectedYear={yearInput}
                onChange={(year) => {
                  setYearInput(year);
                  setCurrentPage(0);
                }}
              />
            )}

            {timeFilterMode === 'MONTH' && (
              <YearMonthSelector
                selectedYearMonth={monthInput}
                onChange={(yearMonth) => {
                  setMonthInput(yearMonth);
                  setCurrentPage(0);
                }}
              />
            )}
          </div>
        </div>

        {isFilterActive && (
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setTimeFilterMode('ALL');
              setCurrentPage(0);
            }}
            className="text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-2 transition-colors self-start sm:self-center"
          >
            Reset Filters
          </button>
        )}
      </div>

      {matchingOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No matching orders</h3>
          <p className="text-muted-foreground mb-6">We couldn't find any orders matching your selected status or time period.</p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setTimeFilterMode('ALL');
              setCurrentPage(0);
            }}
            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-sm shadow-primary-500/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => {
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
                  <p className="font-bold text-sm">₹{order.totalAmount.toFixed(2)}</p>
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
                    <span className={getTimelineProgress(order.status) >= 65 ? 'text-primary-600' : ''}>Preparing</span>
                    <span className={getTimelineProgress(order.status) >= 85 ? 'text-primary-600' : ''}>Out for Delivery</span>
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
                {(order.paymentStatus === 'PENDING' || order.paymentStatus === 'FAILED' || order.paymentMethod === 'CASH') && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button 
                    onClick={() => navigate(`/payment/${order.id}`, { state: { amount: order.totalAmount, paymentMethod: 'CARD' } })}
                    className="flex-1 sm:flex-none flex items-center justify-center bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <CreditCard className="w-4 h-4 mr-2" /> {order.paymentStatus === 'FAILED' ? 'Retry Payment' : 'Pay Now'}
                  </button>
                )}
                
                {/* Cancel Order button: only if payment is NOT made */}
                {order.paymentStatus !== 'COMPLETED' && order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button 
                    onClick={() => openCancelModal(order.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Cancel Order
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
                                Qty: {item.quantity} × ₹{(item.unitPrice || 0).toFixed(2)}
                                {item.taxClass && item.taxRate > 0 && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-medium text-muted-foreground">
                                    {item.taxClass} ({(item.taxRate * 100).toFixed(0)}%)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="font-bold text-sm text-foreground">₹{(item.totalPrice || ((item.unitPrice || 0) * item.quantity)).toFixed(2)}</p>
                            {order.status === 'DELIVERED' && (() => {
                              const localReview = reviews.data[item.productId]?.find(r => r.userId === user.id);
                              const isReviewed = localReview || item.hasReviewed;
                              return (
                                <button
                                  onClick={() => openReviewModal(order.id, item.productId, item.productName, localReview)}
                                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
                                >
                                  {isReviewed ? 'Edit' : 'Rate Product'}
                                </button>
                              );
                            })()}
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
                          <span className="font-semibold text-foreground">₹{(order.totalAmount - (order.taxAmount || 0) - (order.deliveryFee || 0) + (order.discountAmount || 0)).toFixed(2)}</span>
                        </div>
                        {order.taxAmount > 0 && (
                          <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span className="font-semibold text-foreground">₹{order.taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {order.discountAmount > 0 && (
                          <div className="flex justify-between text-green-500">
                            <span>Discount</span>
                            <span className="font-semibold">-₹{order.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Delivery Fee</span>
                          <span className="font-semibold text-foreground">{order.deliveryFee > 0 ? `₹${order.deliveryFee.toFixed(2)}` : 'Free'}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base text-foreground">
                          <span>Total</span>
                          <span className="text-primary-600">₹{order.totalAmount.toFixed(2)}</span>
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
                            {order.paymentMethod || 'N/A'} - <span className={`font-bold ${order.paymentStatus === 'COMPLETED' || order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentStatus === 'FAILED' ? 'PENDING' : (order.paymentStatus || 'PENDING')}</span>
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
      )}
      
      <ReviewModal 
        isOpen={reviewModalState.isOpen}
        onClose={closeReviewModal}
        orderId={reviewModalState.orderId}
        productId={reviewModalState.productId}
        productName={reviewModalState.productName}
        existingReview={reviewModalState.existingReview}
      />

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
