import React, { useState, useEffect } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CachedImage } from '../../../../components/ui/CachedImage';
import { ShowcaseCard } from '../../../../components/ui/ShowcaseCard';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { GiCroissant, GiWheat, GiPretzel, GiCupcake, GiCakeSlice, GiCoffeeCup } from 'react-icons/gi';
import { sliderVariants } from '../../../../utils/animations';
import { FadeIn } from '../../../../components/animations/FadeIn';

export function HeroSection({ campaigns, topRatedProducts }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 1000], ['0%', '40%']);

    useEffect(() => {
        if (!campaigns || campaigns.length === 0) return;
        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % campaigns.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [campaigns]);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % campaigns.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev === 0 ? campaigns.length - 1 : prev - 1));
    };

    return (
        <section className="w-full bg-transparent relative flex items-center justify-center overflow-hidden" style={{ height: 'calc(100dvh - 80px)' }}>
            {/* Foreground Center Slider */}
            <div className="w-full h-full relative z-30 flex items-center justify-center pointer-events-none">
                <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full relative overflow-hidden bg-white group pointer-events-auto"
                >
                    <AnimatePresence initial={false} custom={direction}>
                        {campaigns?.length > 0 && (
                            <m.div
                                key={activeIndex}
                                custom={direction}
                                variants={sliderVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                className="absolute inset-0 w-full h-full overflow-hidden"
                            >
                                <m.div 
                                    style={{ y: yParallax, scale: 1.4 }} 
                                    className="w-full h-full absolute inset-0 origin-bottom"
                                >
                                    <CachedImage 
                                        src={campaigns[activeIndex]?.imageUrl} 
                                        alt={`Campaign ${activeIndex + 1}`} 
                                        className="w-full h-full object-cover object-center"
                                    />
                                </m.div>
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                                
                                {/* Overlay Text */}
                                <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-16 lg:px-24 xl:px-32 z-40 max-w-7xl mx-auto w-full">
                                    <FadeIn delay={0.3} variant="fadeInUp">
                                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white drop-shadow-xl tracking-tight mb-6 max-w-3xl">
                                            {campaigns[activeIndex]?.title || "Freshly Baked Perfection"}
                                        </h1>
                                    </FadeIn>
                                    
                                    <FadeIn delay={0.5} variant="fadeInUp">
                                        <p className="text-lg md:text-2xl text-stone-100 font-medium max-w-xl drop-shadow-md mb-10">
                                            {campaigns[activeIndex]?.description || campaigns[activeIndex]?.subtitle || "Experience the warmth of our handcrafted pastries, baked fresh daily with 100% organic ingredients and lots of love."}
                                        </p>
                                    </FadeIn>
                                    
                                    <FadeIn delay={0.7} variant="scaleUp">
                                        <button 
                                            onClick={() => navigate('/shop')}
                                            className="bg-[#eab308] hover:bg-yellow-400 text-stone-900 font-bold text-lg md:text-xl px-10 py-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-1 transform transition-all duration-300"
                                        >
                                            {campaigns[activeIndex]?.buttonText || "Explore Our Menu"}
                                        </button>
                                    </FadeIn>
                                    
                                    {/* Social Proof */}
                                    <FadeIn delay={0.9} variant="fadeInUp">
                                        <div className="flex items-center space-x-4 mt-10 backdrop-blur-sm bg-black/20 py-2 px-4 rounded-full border border-white/10">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-stone-800 bg-white overflow-hidden relative shadow-sm" style={{ zIndex: 10 - i }}>
                                                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=Customer${i + 50}&backgroundColor=fdf8f5`} alt="Customer" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col items-start leading-tight">
                                                <div className="flex text-[#eab308] text-xs">
                                                    ★★★★★
                                                </div>
                                                <span className="text-stone-200 text-sm font-medium">Loved by 5,000+ pastry lovers</span>
                                            </div>
                                        </div>
                                    </FadeIn>

                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </m.div>
            </div>

            {/* Floating Showcase Card */}
            {topRatedProducts && topRatedProducts.length > 0 && (
                <FadeIn delay={1.2} variant="slideInRight" className="absolute bottom-8 md:bottom-12 right-6 md:right-16 lg:right-24 z-40 hidden md:block w-[260px] lg:w-[300px]">
                    <div className="relative group">
                        <AnimatePresence mode="wait">
                            <m.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="transform scale-95 origin-bottom-right drop-shadow-2xl relative"
                            >
                                {/* Featured Label */}
                                <div className="absolute -top-4 -right-4 z-50 bg-[#eab308] text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform">
                                    Trending Now!
                                </div>
                                <div className="pointer-events-auto">
                                    <ShowcaseCard 
                                        product={topRatedProducts[activeIndex % topRatedProducts.length]} 
                                        idx={activeIndex} 
                                    />
                                </div>
                            </m.div>
                        </AnimatePresence>
                    </div>
                </FadeIn>
            )}

        </section>
    );
}
