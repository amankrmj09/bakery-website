import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { LuStar as Star, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight, LuArrowRight as ArrowRight } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';
import ProductCard from '../ProductCard';
import { addItemToCart, fetchCart } from '../../../cart/redux/cartThunk';

export function TopCategoriesSection({ topCategoriesWithProducts, productList }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);

    const topCategories = topCategoriesWithProducts?.map(t => t.category) || [];
    const activeCategory = topCategories[activeTopCategoryIndex];

    const categoryProducts = activeCategory && topCategoriesWithProducts[activeTopCategoryIndex]
        ? topCategoriesWithProducts[activeTopCategoryIndex].topProducts || []
        : [];
        
    const topRatedProduct = categoryProducts.length > 0 
        ? categoryProducts[0] 
        : null;

    const handlePrevCategory = () => {
        if (topCategories.length === 0) return;
        setActiveTopCategoryIndex(prev => (prev === 0 ? topCategories.length - 1 : prev - 1));
    };

    const handleNextCategory = () => {
        if (topCategories.length === 0) return;
        setActiveTopCategoryIndex(prev => (prev === topCategories.length - 1 ? 0 : prev + 1));
    };

    const getCategoryColor = (index) => {
        const colors = ['bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-pink-50'];
        return colors[index % colors.length];
    };

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
            className="bg-card py-10"
        >
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-2">
                        <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground"/></span>
                        <h2 className="text-2xl font-bold font-serif text-foreground">Artisan Collections</h2>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrevCategory}
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <ChevronLeft className="w-5 h-5"/></button>
                        <button
                            onClick={handleNextCategory}
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                            <ChevronRight className="w-5 h-5"/></button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeCategory ? (
                        <motion.div 
                            key={activeCategory.id || activeCategory.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col md:flex-row items-center gap-6 bg-background border border-border rounded-[2rem] p-8 shadow-sm relative overflow-hidden min-h-[300px]"
                            style={{
                                backgroundImage: activeCategory.mediaUrls?.[0] ? `url(${activeCategory.mediaUrls[0]})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {activeCategory.mediaUrls?.[0] && (
                                <div className="absolute inset-0 bg-black/50 z-0" />
                            )}
                             <div className="flex flex-col items-center md:items-start flex-1 z-10 text-white">
                                 <div
                                     className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${getCategoryColor(activeTopCategoryIndex)} flex items-center justify-center mb-4 overflow-hidden p-3 shadow-inner bg-white/20 backdrop-blur-md`}>
                                     <CachedImage
                                         src={activeCategory.mediaUrls?.[0]}
                                         alt={activeCategory.name}
                                         className="w-full h-full object-cover rounded-full"
                                     />
                                 </div>
                                 <h3 className="text-3xl font-extrabold font-serif text-white mb-2">{activeCategory.name}</h3>
                                {activeCategory.description && (
                                    <p className="text-white/80 mb-4 text-sm text-center md:text-left max-w-sm">
                                        {activeCategory.description}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex-1 w-full max-w-[320px] mx-auto md:mx-0 z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-[#eab308] font-bold text-sm tracking-wider uppercase text-center md:text-left">Top Rated in {activeCategory.name}</h4>
                                </div>
                                {topRatedProduct ? (
                                    <div className="bg-primary-500 rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between group w-full">
                                        <div className="z-10 text-white w-2/3">
                                            {topRatedProduct.categoryName && <span className="text-white/80 font-semibold text-sm uppercase">{topRatedProduct.categoryName}</span>}
                                            <h3 className="text-2xl font-bold leading-tight mt-1 mb-2">{topRatedProduct.name}</h3>
                                        </div>

                                        {topRatedProduct.status !== 'ACTIVE' ? (
                                            <div className="absolute top-6 right-6 z-20 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide backdrop-blur-md">
                                                Unavailable
                                            </div>
                                        ) : topRatedProduct.inventory?.isOutOfStock ? (
                                            <div className="absolute top-6 right-6 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                                                Out of Stock
                                            </div>
                                        ) : topRatedProduct.inventory?.isLowStock ? (
                                            <div className="absolute top-6 right-6 z-20 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                                                Limited Stock
                                            </div>
                                        ) : null}

                                        <CachedImage
                                            src={topRatedProduct.primaryImageUrl || topRatedProduct.mediaUrls?.[0]}
                                            alt={topRatedProduct.name}
                                            className="absolute -bottom-4 -right-4 h-[70%] w-[70%] object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 border-4 border-white/20"
                                        />

                                        <button onClick={async () => {
                                                    if (!user) {
                                                        toast.error("You must login before checking out");
                                                        navigate('/login');
                                                        return;
                                                    }
                                                    await handleAddToCart(topRatedProduct);
                                                    navigate('/checkout');
                                                }}
                                                disabled={topRatedProduct.status !== 'ACTIVE' || topRatedProduct.inventory?.isOutOfStock}
                                                className="z-10 text-white font-medium text-sm flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-5 py-2 group/btn mt-auto self-start disabled:opacity-50 disabled:cursor-not-allowed border border-white/20">
                                            Order Now <ArrowRight
                                            className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"/>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                                        No products available in this category.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="p-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm bg-background">
                            No top categories available.
                        </div>
                    )}
                </AnimatePresence>

                <div className="mt-12 text-center mb-8">
                    <span
                        className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">Signature Delights</span>
                    <h2 className="text-3xl font-extrabold font-serif text-[#eab308] mt-2">Our Most Loved Creations</h2>
                </div>

                <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar">
                    {productList?.slice(0, 5).map(product => (
                        <ProductCard key={product.id} product={product} className="min-w-[280px] w-[280px] max-w-[280px] flex-shrink-0" />
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
