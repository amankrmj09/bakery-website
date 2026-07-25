import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemToCart, fetchCart } from '../../cart/redux/cartThunk';
import { LuShoppingCart as ShoppingCart, LuLoader as Loader2, LuStar as Star } from 'react-icons/lu';
import { toast } from 'sonner';

export default function ProductCard({ product, className = "" }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { reviews } = useSelector((state) => state.shop);
    
    const productReviews = reviews?.data?.[product.id] || [];
    const displayCount = productReviews.length > 0 ? productReviews.length : (product.totalReviews || 0);
    const displayRating = productReviews.length > 0 
        ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1) 
        : (product.averageRating > 0 ? product.averageRating.toFixed(1) : '0.0');
    
    const [addingToCart, setAddingToCart] = useState(null);

    const handleAddToCart = async () => {
        setAddingToCart(product.id);
        try {
            let currentCartId = cart?.id;
            if (!currentCartId) {
                const newCart = await dispatch(fetchCart()).unwrap();
                currentCartId = newCart?.id;
            }
            
            if (!currentCartId) {
                toast.error('Unable to initialize cart');
                return;
            }

            await dispatch(addItemToCart({ cartId: currentCartId, productId: product.id, quantity: 1 })).unwrap();
            toast.success(`${product.name} added to cart`);
        } catch (error) {
            toast.error(`Failed to add ${product.name} to cart`);
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className={`group bg-card border border-border rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-4 relative ${className}`}>
            <div 
                className="aspect-square bg-muted/30 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
            >
                <img 
                    src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                    alt={product.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                    className="object-cover w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                />
                {product.status !== 'ACTIVE' ? (
                    <div className="absolute top-2 right-2 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                        Unavailable
                    </div>
                ) : product.inventory?.isOutOfStock ? (
                    <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                        Out of Stock
                    </div>
                ) : product.inventory?.isLowStock ? (
                    <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                        Limited Stock
                    </div>
                ) : null}
            </div>
            
            <div className="pt-4 flex flex-col flex-1">
                <div className="flex flex-col mb-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.categoryName || 'Treat'}</span>
                    <h3 
                        className="font-extrabold text-lg text-foreground leading-tight line-clamp-1 cursor-pointer hover:text-primary-500 transition-colors" 
                        title={product.name}
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        {product.name}
                    </h3>
                </div>
                {/* Always render the rating container, but check if there are any reviews */}
                <div className="flex items-center gap-1 mt-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-foreground">
                        {displayRating}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                        ({displayCount})
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 mt-2">
                    {product.description || 'A delicious treat fresh from our bakery.'}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="font-extrabold text-xl text-primary-500">${product.price?.toFixed(2) || '0.00'}</span>
                    <div className="flex space-x-2">
                        <button
                            disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock || addingToCart === product.id}
                            onClick={handleAddToCart}
                            className="w-12 h-12 flex items-center justify-center bg-muted/50 text-foreground hover:bg-primary-500 hover:text-white transition-colors rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                            title="Add to Cart"
                        >
                            {addingToCart === product.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            )}
                        </button>
                        <button
                            disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock || addingToCart === product.id}
                            onClick={async () => {
                                if (!user) {
                                    toast.error("You must login before checking out");
                                    navigate('/login');
                                    return;
                                }
                                await handleAddToCart();
                                navigate('/checkout');
                            }}
                            className="px-6 flex items-center justify-center bg-foreground text-card hover:bg-primary-500 hover:text-white transition-colors rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
