import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { LuArrowRight as ArrowRight } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';
import { addItemToCart, fetchCart } from '../../../cart/redux/cartThunk';

export function NewProductsSection({ productList }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

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

    return (
        <motion.section 
            variants={sectionVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.1 }}
            className="max-w-7xl mx-auto w-full px-6 py-16"
        >
            <div className="text-center mb-10">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">Seasonal Offerings</span>
                <h2 className="text-4xl font-extrabold font-serif text-[#eab308] mt-2">Freshly Baked Arrivals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productList.slice(0, 4).map((product, idx) => {
                    const cardColors = ['bg-primary-500', 'bg-[#eab308]', 'bg-red-500', 'bg-green-500'];
                    const colorClass = cardColors[idx % cardColors.length];
                    return (
                        <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`${colorClass} rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between group`}
                        >
                            <div className="z-10 text-white w-2/3">
                                {product.categoryName && <span className="text-white/80 font-semibold text-sm uppercase">{product.categoryName}</span>}
                                <h3 className="text-2xl font-bold leading-tight mt-1 mb-2">{product.name}</h3>
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
                                src={product.primaryImageUrl || product.mediaUrls?.[0]}
                                alt={product.name}
                                className="absolute -bottom-4 -right-4 h-[70%] w-[70%] object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 border-4 border-white/20"
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
                })}
            </div>
        </motion.section>
    );
}
