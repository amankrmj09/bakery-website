import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { fetchProductReviews, reportReview, fetchProductById } from '../redux/shopThunk';
import { LuArrowLeft as ArrowLeft, LuShoppingCart as ShoppingCart, LuMinus as Minus, LuPlus as Plus, LuLoader as Loader2, LuPackage as Package, LuInfo as Info, LuStar as Star, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight } from 'react-icons/lu';
import ReviewModal from '../components/ReviewModal';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { products, reviews } = useSelector((state) => state.shop);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewModalState, setReviewModalState] = useState({
    isOpen: false,
    existingReview: null
  });
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(0);
  const [reviewsPageSize, setReviewsPageSize] = useState(6);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  // We find the product from redux store since we already fetched it on the shop page,
  // or we might need to fetch it if we navigate directly to the URL.
  // For simplicity, assuming it's in the store or we can get it from there.
  // In a real scenario, we'd fetch the specific product by ID if not found.
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (products.data.length > 0) {
        const found = products.data.find(p => p.id === id);
        if (found) {
          setProduct(found);
          setLoading(false);
          return;
        }
      }
      
      try {
        const res = await dispatch(fetchProductById(id)).unwrap();
        setProduct(res);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, products.data, dispatch]);

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductReviews({ 
        productId: product.id, 
        params: { page: reviewsCurrentPage, size: reviewsPageSize, sortBy: 'createdAt_desc' } 
      }));
    }
  }, [dispatch, product?.id, reviewsCurrentPage, reviewsPageSize]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      let currentCartId = cart?.id;
      if (!currentCartId) {
        toast.error('Unable to initialize cart');
        return;
      }

      await dispatch(addItemToCart({ cartId: currentCartId, productId: product.id, quantity })).unwrap();
      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (error) {
      toast.error(`Failed to add ${product.name} to cart`);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("You must login before checking out");
      navigate('/login');
      return;
    }
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p className="text-muted-foreground font-medium">Loading delicious details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The sweet treat you're looking for seems to have vanished.</p>
        <button onClick={() => navigate('/shop')} className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm">
          Back to Menu
        </button>
      </div>
    );
  }

  const isUnavailable = product.status !== 'ACTIVE';
  const isOutOfStock = product.inventory?.isOutOfStock;
  const canPurchase = !isUnavailable && !isOutOfStock;

  const rawReviews = reviews?.data?.[product.id];
  const productReviews = rawReviews?.content || rawReviews?._embedded?.reviewResponseList || (Array.isArray(rawReviews) ? rawReviews : []);
  const reviewsPagination = rawReviews?.page || (rawReviews?.totalPages !== undefined ? rawReviews : null);
  const displayCount = reviewsPagination?.totalElements !== undefined ? reviewsPagination.totalElements : (productReviews.length > 0 ? productReviews.length : (product.totalReviews || 0));
  const displayRating = productReviews.length > 0 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1) 
    : (product.averageRating > 0 ? product.averageRating.toFixed(1) : '0.0');

  const allImages = product ? Array.from(new Set([
    ...(product.primaryImageUrl ? [product.primaryImageUrl] : []),
    ...(product.mediaUrls || [])
  ])) : [];
  const displayImage = selectedImage || allImages[0] || '/images/placeholder_bakery.png';

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-sm font-bold text-muted-foreground hover:text-primary-500 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </button>

        <div className="bg-card rounded-[2.5rem] p-6 md:p-10 shadow-lg border border-border flex flex-col md:flex-row gap-10 md:gap-16">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-muted/30 rounded-3xl relative overflow-hidden flex items-center justify-center border border-border/50">
              <img 
                src={displayImage} 
                alt={product.name} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 hover:scale-105" 
              />
              {isUnavailable ? (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-md">
                  Unavailable
                </div>
              ) : isOutOfStock ? (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-md">
                  Out of Stock
                </div>
              ) : product.inventory?.isLowStock ? (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-md">
                  Limited Stock
                </div>
              ) : null}
            </div>
            
            {/* Thumbnails if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-4 mt-2 overflow-x-auto py-2 px-1 custom-scrollbar w-full max-w-full min-w-0">
                {allImages.map((url, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(url)}
                    className={`w-20 h-20 flex-shrink-0 bg-muted/30 rounded-xl overflow-hidden border transition-all ${displayImage === url ? 'border-primary-500 ring-2 ring-primary-500/50 ring-offset-2 ring-offset-background' : 'border-border hover:border-primary-500/50'}`}
                  >
                     <img src={url} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full">
                {product.category?.name || 'Treat'}
              </span>
              {product.taxClass && product.taxRate > 0 && (
                 <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border">
                   {product.taxClass} ({(product.taxRate * 100).toFixed(0)}% tax)
                 </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-foreground mb-6 flex flex-wrap items-end gap-2">
              {product.discountPrice && product.discountPrice < product.price ? (
                <>
                   <span className="text-primary-500">${product.discountPrice.toFixed(2)}</span>
                   <span className="text-xl text-muted-foreground line-through">${product.price?.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-primary-500">${product.price?.toFixed(2)}</span>
              )}
              {product.unit && (
                <span className="text-sm font-medium text-muted-foreground mb-1">/ {product.unit}</span>
              )}
              <span className="text-sm font-medium text-muted-foreground mb-1 ml-2 border-l border-border pl-2">(exclusive of tax)</span>
            </div>
            
            {/* Simple Underline Tabs */}
            <div className="flex flex-col min-h-[350px] mb-8">
              {/* Tab Navigation */}
              <div className="flex overflow-x-auto gap-6 border-b border-border mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`pb-4 text-base font-bold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === 'about' 
                      ? 'border-primary-500 text-primary-500' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  Description
                </button>

                {product.ingredients && product.ingredients.length > 0 && (
                  <button 
                    onClick={() => setActiveTab('ingredients')}
                    className={`pb-4 text-base font-bold transition-all whitespace-nowrap border-b-2 ${
                      activeTab === 'ingredients' 
                        ? 'border-primary-500 text-primary-500' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    Ingredients
                  </button>
                )}

                {product.allergens && product.allergens.length > 0 && (
                  <button 
                    onClick={() => setActiveTab('allergens')}
                    className={`pb-4 text-base font-bold transition-all whitespace-nowrap border-b-2 ${
                      activeTab === 'allergens' 
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    Allergens
                  </button>
                )}

                {(product.calories || product.shelfLifeHours) && (
                  <button 
                    onClick={() => setActiveTab('other')}
                    className={`pb-4 text-base font-bold transition-all whitespace-nowrap border-b-2 ${
                      activeTab === 'other' 
                        ? 'border-primary-500 text-primary-500' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    Other Details
                  </button>
                )}
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 relative z-10">
                  {activeTab === 'about' && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                        {product.description || 'A delicious treat fresh from our bakery, crafted with the finest ingredients.'}
                      </p>
                    </div>
                  )}
                  {activeTab === 'ingredients' && product.ingredients && product.ingredients.length > 0 && (
                    <div className="animate-in fade-in duration-300">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 max-w-4xl">
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center text-muted-foreground text-lg font-medium">
                            <span className="w-2 h-2 rounded-full bg-primary-500 mr-3 flex-shrink-0"></span>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'allergens' && product.allergens && product.allergens.length > 0 && (
                    <div className="animate-in fade-in duration-300">
                      <div className="inline-block bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-5 py-3 rounded-2xl">
                        <p className="font-bold text-orange-800 dark:text-orange-300 text-base">
                          {product.allergens.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'other' && (product.calories || product.shelfLifeHours) && (
                    <div className="animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.calories && (
                          <div className="bg-background border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Calories</span>
                            <p className="font-black text-foreground text-2xl">{product.calories}</p>
                          </div>
                        )}
                        {product.shelfLifeHours && (
                          <div className="bg-background border border-border/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Shelf Life</span>
                            <p className="font-black text-foreground text-4xl">{product.shelfLifeHours} <span className="text-lg font-medium text-muted-foreground">hrs</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-border flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-auto">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Quantity</label>
                <div className="flex items-center bg-card border-2 border-border rounded-xl p-1 h-14 w-full sm:w-32">
                  <button 
                    disabled={!canPurchase || quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors disabled:opacity-50 text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-lg text-foreground">{quantity}</span>
                  <button 
                    disabled={!canPurchase || (product.maxOrderQuantity && quantity >= product.maxOrderQuantity)}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors disabled:opacity-50 text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex gap-3 w-full">
                <button
                  disabled={!canPurchase || addingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-muted text-foreground border-2 border-border hover:border-primary-500 hover:text-primary-600 transition-all rounded-xl font-bold flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                
                <button
                  disabled={!canPurchase || addingToCart}
                  onClick={handleBuyNow}
                  className="flex-1 h-14 bg-primary-500 text-white hover:bg-primary-600 transition-all rounded-xl font-bold flex items-center justify-center shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Buy Now
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-card rounded-[2.5rem] p-6 md:p-10 shadow-lg border border-border">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
            <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700">{displayRating}</span>
              <span className="text-sm font-medium text-yellow-700/70">({displayCount})</span>
            </div>
          </div>

          <div className="space-y-6">
            {productReviews.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border/50">
                <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg font-medium text-muted-foreground">No reviews yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to review this delicious treat!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productReviews.map((review) => (
                  <div key={review.id} className="bg-background border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-foreground">{review.userName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground text-sm italic mb-4">"{review.comment}"</p>
                    )}
                    <div className="flex gap-4 mt-2 border-t border-border pt-3">
                      {user?.id === review.userId ? (
                        <button 
                          onClick={() => setReviewModalState({ isOpen: true, existingReview: review })}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            const reason = window.prompt('Why are you reporting this review?');
                            if (reason) {
                              dispatch(reportReview({ productId: product.id, reviewId: review.id, reason }))
                                .unwrap()
                                .then(() => toast.success('Review reported for moderation'))
                                .catch(() => toast.error('Failed to report review'));
                            }
                          }}
                          className="text-xs text-muted-foreground hover:text-primary-500 font-medium"
                        >
                          Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Reviews Pagination Controls */}
            {reviewsPagination && (reviewsPagination.totalPages > 1 || reviewsPagination.totalElements > 0) && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Page <strong className="text-foreground">{reviewsPagination.number + 1}</strong> of <strong className="text-foreground">{reviewsPagination.totalPages || 1}</strong></span>
                  <span>({reviewsPagination.totalElements} reviews)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 sm:border-r border-border sm:pr-3">
                    <label htmlFor="reviewsPageSize" className="text-xs font-semibold text-muted-foreground">Show:</label>
                    <select
                      id="reviewsPageSize"
                      value={reviewsPageSize}
                      onChange={(e) => {
                        setReviewsPageSize(Number(e.target.value));
                        setReviewsCurrentPage(0);
                      }}
                      className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={4}>4</option>
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setReviewsCurrentPage((prev) => Math.max(0, prev - 1))}
                      disabled={reviewsPagination.number === 0 || reviews.loading}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {(() => {
                      const total = reviewsPagination.totalPages || 1;
                      const current = reviewsPagination.number || 0;
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
                            <React.Fragment key={`ellipsis-${pageIdx}`}>
                              <span className="px-1 text-xs text-muted-foreground">...</span>
                              <button
                                onClick={() => setReviewsCurrentPage(pageIdx)}
                                disabled={reviews.loading}
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
                            onClick={() => setReviewsCurrentPage(pageIdx)}
                            disabled={reviews.loading}
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
                      onClick={() => setReviewsCurrentPage((prev) => Math.min((reviewsPagination.totalPages || 1) - 1, prev + 1))}
                      disabled={reviewsPagination.number >= ((reviewsPagination.totalPages || 1) - 1) || reviews.loading || reviewsPagination.totalPages === 0}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ReviewModal
          isOpen={reviewModalState.isOpen}
          onClose={() => setReviewModalState({ isOpen: false, existingReview: null })}
          productId={product.id}
          productName={product.name}
          existingReview={reviewModalState.existingReview}
        />
      </div>
    </div>
  );
}
