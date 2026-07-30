import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { LuArrowRight as ArrowRight } from 'react-icons/lu';
import { CachedImage } from './CachedImage';
import { addItemToCart, fetchCart } from '../../features/cart/redux/cartThunk';

export function ShowcaseCard({ product, idx = 0 }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const handleAddToCart = async (product) => {
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
        }
    };

    const imageUrl = product.primaryImageUrl || product.mediaUrls?.[0];

    return (
        <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-stone-900 rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between group"
        >
            {imageUrl && (
                <>
                    <CachedImage
                        src={imageUrl}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover object-center scale-x-[-1.5] scale-y-[1.5] group-hover:scale-x-[-1.7] group-hover:scale-y-[1.7] transition-transform duration-700 z-0"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500 z-0" />
                </>
            )}

            <div className="z-10 text-white relative">
                {product.categoryName && <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">{product.categoryName}</span>}
                <h3 className="text-3xl font-bold leading-tight mt-1 mb-2 drop-shadow-md">{product.name}</h3>
            </div>

            {product.status !== 'ACTIVE' ? (
                <div className="absolute top-6 right-6 z-20 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide backdrop-blur-md">
                    Unavailable
                </div>
            ) : product.inventory?.isOutOfStock ? (
                <div className="absolute top-6 right-6 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                    Out of Stock
                </div>
            ) : product.inventory?.isLowStock ? (
                <div className="absolute top-6 right-6 z-20 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                    Limited Stock
                </div>
            ) : null}

            <CachedImage
                src={imageUrl}
                alt={product.name}
                className="absolute -bottom-4 -right-4 h-[70%] w-[70%] object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 border-4 border-white/20 z-10"
            />

            <button onClick={async () => {
                        if (!user) {
                            toast.error("You must login before checking out");
                            navigate('/login');
                            return;
                        }
                        await handleAddToCart(product);
                        navigate('/checkout');
                    }}
                    disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock}
                    className="z-10 text-white font-medium text-sm flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-5 py-2 group/btn mt-auto self-start disabled:opacity-50 disabled:cursor-not-allowed border border-white/20">
                Order Now <ArrowRight
                className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"/>
            </button>
        </motion.div>
    );
}
