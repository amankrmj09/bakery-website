import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { fetchProductReviews } from '../redux/shopThunk';
import { LuArrowLeft as ArrowLeft, LuShoppingCart as ShoppingCart, LuMinus as Minus, LuPlus as Plus, LuLoader as Loader2, LuPackage as Package, LuInfo as Info, LuStar as Star } from 'react-icons/lu';

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

  // We find the product from redux store since we already fetched it on the shop page,
  // or we might need to fetch it if we navigate directly to the URL.
  // For simplicity, assuming it's in the store or we can get it from there.
  // In a real scenario, we'd fetch the specific product by ID if not found.
  useEffect(() => {
    if (products.data.length > 0) {
      const found = products.data.find(p => p.id === id);
      setProduct(found || null);
      setLoading(false);
    } else {
      // If products are not loaded (e.g. direct link), we should ideally fetch it.
      // For now, we will just rely on what we have, or show an error.
      // In the context of this project, we can just redirect to shop if not found or wait.
      setLoading(false);
    }
  }, [id, products.data]);

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductReviews(product.id));
    }
  }, [dispatch, product?.id]);

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

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-muted-foreground hover:text-foreground font-medium transition-colors mb-8 bg-card px-4 py-2 rounded-xl shadow-sm border border-border w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-card rounded-[2.5rem] p-6 md:p-10 shadow-lg border border-border flex flex-col md:flex-row gap-10 md:gap-16">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-muted/30 rounded-3xl relative overflow-hidden flex items-center justify-center border border-border/50">
              <img 
                src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
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
            {product.mediaUrls && product.mediaUrls.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                {product.mediaUrls.map((url, idx) => (
                  <div key={idx} className="w-20 h-20 flex-shrink-0 bg-muted/30 rounded-xl overflow-hidden border border-border">
                     <img src={url} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-primary-500 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full">
                {product.categoryName || 'Treat'}
              </span>
              {product.taxClass && product.taxRate > 0 && (
                 <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border">
                   {product.taxClass} ({(product.taxRate * 100).toFixed(0)}% tax)
                 </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">{product.name}</h1>
            
            <div className="text-3xl font-black text-foreground mb-6 flex items-end gap-2">
              ${product.price?.toFixed(2)}
              {product.weightGrams && (
                <span className="text-sm font-medium text-muted-foreground mb-1">/ {product.weightGrams}g</span>
              )}
            </div>
            
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 mb-8">
              <h3 className="font-bold flex items-center text-foreground mb-2"><Info className="w-4 h-4 mr-2 text-primary-500" /> Description</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {product.description || 'A delicious treat fresh from our bakery, crafted with the finest ingredients.'}
              </p>
            </div>

            {/* Extra Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.caloriesPerUnit && (
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Calories</span>
                  <p className="font-bold text-foreground text-lg">{product.caloriesPerUnit} kcal</p>
                </div>
              )}
              {product.shelfLifeHours && (
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Shelf Life</span>
                  <p className="font-bold text-foreground text-lg">{product.shelfLifeHours} hrs</p>
                </div>
              )}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Ingredients</span>
                  <p className="font-medium text-foreground text-sm mt-1">{product.ingredients.join(', ')}</p>
                </div>
              )}
              {product.allergens && product.allergens.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20 rounded-xl p-4 shadow-sm col-span-2">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Contains Allergens</span>
                  <p className="font-bold text-orange-800 dark:text-orange-300 text-sm mt-1">{product.allergens.join(', ')}</p>
                </div>
              )}
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
              <span className="font-bold text-yellow-700">{product.averageRating || 'New'}</span>
              <span className="text-sm font-medium text-yellow-700/70">({product.totalReviews || 0})</span>
            </div>
          </div>

          <div className="space-y-6">
            {!reviews.data[product.id] || reviews.data[product.id].length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border/50">
                <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-lg font-medium text-muted-foreground">No reviews yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to review this delicious treat!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.data[product.id].map((review) => (
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
                      <p className="text-muted-foreground text-sm italic">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
