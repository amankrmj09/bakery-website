import React, { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { LuStar as Star, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight, LuArrowRight as ArrowRight } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';
import ProductCard from '../ProductCard';
import { ShowcaseCard } from '../../../../components/ui/ShowcaseCard';
import { addItemToCart, fetchCart } from '../../../cart/redux/cartThunk';

export function TopCategoriesSection({ topCategoriesWithProducts, productList, topRatedProducts }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);
    
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const yParallax = useTransform(scrollYProgress, [0, 1], ['-25%', '25%']);

    const topCategories = topCategoriesWithProducts?.map(t => t.category) || [];

    useEffect(() => {
        if (topCategories.length > 1) {
            const timer = setInterval(() => {
                setActiveTopCategoryIndex(prev => (prev === topCategories.length - 1 ? 0 : prev + 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [topCategories.length]);

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
        <m.section 
            ref={containerRef}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="bg-transparent py-10"
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
                        <m.div 
                            key={activeCategory.id || activeCategory.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col md:flex-row items-center gap-6 bg-background border border-border rounded-[2rem] p-8 shadow-sm relative overflow-hidden min-h-[300px]"
                        >
                            {activeCategory.mediaUrls?.[0] && (
                                <>
                                    <m.div 
                                        style={{ y: yParallax, scale: 1.5 }} 
                                        className="w-full h-full absolute inset-0 z-0 origin-center pointer-events-none"
                                    >
                                        <CachedImage 
                                            src={activeCategory.mediaUrls[0]} 
                                            alt={activeCategory.name} 
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </m.div>
                                    <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
                                </>
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
                                    <ShowcaseCard product={topRatedProduct} />
                                ) : (
                                    <div className="p-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                                        No products available in this category.
                                    </div>
                                )}
                            </div>
                        </m.div>
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
                    {(topRatedProducts?.length > 0 ? topRatedProducts.slice(0, 4) : productList?.slice(0, 4))?.map(product => (
                        <ProductCard key={product.id} product={product} className="min-w-[280px] w-[280px] max-w-[280px] flex-shrink-0" />
                    ))}
                </div>
            </div>
        </m.section>
    );
}
