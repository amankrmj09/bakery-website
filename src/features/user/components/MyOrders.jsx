import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders, cancelUserOrder } from '../../order/slice/orderSlice';
import { LuPackage as Package, LuLoader as Loader2, LuClock as Clock, LuCheck as CheckCircle2, LuCreditCard as CreditCard, LuX as XCircle, LuChevronRight as ChevronRight, LuChevronLeft as ChevronLeft, LuChevronDown as ChevronDown, LuMapPin as MapPin } from 'react-icons/lu';
import { format } from 'date-fns';
import SleekDropdown from '../../../components/ui/SleekDropdown';
import ReviewModal from '../../shop/components/ReviewModal';
import CancelOrderModal from './CancelOrderModal';
import { toast } from 'sonner';
import { YearSelector, YearMonthSelector, StatusSelector, TimeModeSelector } from './TimeFilterControls';
import OrderCard from '../../order/components/OrderCard';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-6 shadow-sm mb-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">Order History</h2>
          <p className="text-muted-foreground text-sm mt-1">View and track your previous purchases</p>
        </div>
        
        {/* Pagination Controls at Top */}
        {effectivePagination && (effectivePagination.totalPages > 1 || effectivePagination.totalElements > 5 || matchingOrders.length > 0) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-background px-4 py-2.5 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Page <strong className="text-foreground">{effectivePagination.number + 1}</strong> of <strong className="text-foreground">{effectivePagination.totalPages || 1}</strong></span>
              <span>({effectivePagination.totalElements || matchingOrders.length})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 border-l border-border pl-3">
                <label htmlFor="pageSizeTop" className="text-xs font-semibold text-muted-foreground">Show:</label>
                <SleekDropdown
                  options={[
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                  ]}
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(0);
                  }}
                  widthClass="w-20"
                />
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
          {displayOrders.map((order) => (
            <OrderCard 
              key={order.id}
              order={order}
              expandedOrderId={expandedOrderId}
              toggleOrderDetails={toggleOrderDetails}
              openReviewModal={openReviewModal}
              openCancelModal={openCancelModal}
              reviews={reviews}
              user={user}
            />
          ))}
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
