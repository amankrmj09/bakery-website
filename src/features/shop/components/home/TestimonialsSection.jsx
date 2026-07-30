import React, { useRef } from 'react';
import { m, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { LuStar as Star } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';

export function TestimonialsSection({ activeTestimonial, currentTestimonialIndex, featuredTestimonials }) {
    if (!activeTestimonial) return null;

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const prevIndexRef = useRef(currentTestimonialIndex);
    const directionRef = useRef(1);
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    const yParallax = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

    if (prevIndexRef.current !== currentTestimonialIndex) {
        if (prevIndexRef.current === featuredTestimonials.length - 1 && currentTestimonialIndex === 0) {
            directionRef.current = 1; // Keep swiping forwards when looping back to start
        } else if (currentTestimonialIndex < prevIndexRef.current) {
            directionRef.current = -1; // Swipe backwards
        } else {
            directionRef.current = 1;  // Swipe forwards
        }
        prevIndexRef.current = currentTestimonialIndex;
    }
    
    const direction = directionRef.current;

    return (
        <m.section 
            ref={containerRef}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="py-16"
        >
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="text-center mb-10">
                    <span className="text-[#eab308] font-bold tracking-wider text-sm uppercase">Client Testimonials</span>
                    <h2 className="text-3xl font-extrabold font-serif text-foreground mt-2">Words From Our Guests</h2>
                </div>

                <div className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-lg">
                    <div className="md:w-1/2 bg-stone-900 p-12 flex items-center justify-center relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-800/20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-600/20 blur-3xl" />
                        
                        <AnimatePresence mode="popLayout" custom={direction}>
                            {(() => {
                                const hasTitle = activeTestimonial.message?.includes('::');
                                const [title, message] = hasTitle 
                                    ? activeTestimonial.message.split('::') 
                                    : ['Fantastic Experience!', activeTestimonial.message];

                                const cardVariants = {
                                    enter: (dir) => ({
                                        opacity: 0,
                                        x: dir > 0 ? 60 : -60
                                    }),
                                    center: {
                                        opacity: 1,
                                        x: 0
                                    },
                                    exit: (dir) => ({
                                        opacity: 0,
                                        x: dir > 0 ? -60 : 60
                                    })
                                };

                                return (
                                    <m.div 
                                        key={currentTestimonialIndex}
                                        custom={direction}
                                        variants={cardVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="bg-white rounded-[2rem] p-8 md:p-10 relative max-w-sm w-full shadow-2xl z-10"
                                    >
                                        <div
                                            className="absolute -top-6 left-8 text-7xl text-amber-500 font-serif leading-none opacity-80">"
                                        </div>
                                        <h4 className="font-bold text-stone-900 text-xl mb-4 mt-2 font-serif">{title}</h4>
                                        <p className="text-sm text-stone-600 mb-8 italic leading-relaxed min-h-[80px]">
                                            "{message}"
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-stone-100 border-2 border-amber-100 overflow-hidden flex items-center justify-center text-stone-800 font-bold shadow-sm">
                                                    {activeTestimonial.profileImageUrl ? (
                                                        <CachedImage src={activeTestimonial.profileImageUrl} alt={activeTestimonial.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg">{activeTestimonial.name ? activeTestimonial.name.substring(0,2).toUpperCase() : 'U'}</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-sm text-stone-800">{activeTestimonial.name || 'Anonymous User'}</span>
                                            </div>
                                            <div className="flex text-amber-500">
                                                {[...Array(activeTestimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                                            </div>
                                        </div>
                                    </m.div>
                                );
                            })()}
                        </AnimatePresence>
                        
                        {/* Pagination Dots - Moved Outside Animation */}
                        {featuredTestimonials?.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                                {featuredTestimonials.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentTestimonialIndex ? 'bg-amber-500 w-6' : 'bg-white/30'}`} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 relative min-h-[400px] overflow-hidden">
                        <m.div style={{ y: yParallax, scale: 1.3 }} className="absolute inset-0 w-full h-full origin-center">
                            <CachedImage src="/images/bakery_customers.png" alt="Happy Customers"
                                 className="w-full h-full object-cover"/>
                        </m.div>
                        {/* Gradient overlay to blend image nicely */}
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 to-transparent md:bg-gradient-to-l md:from-transparent md:to-stone-900/20" />
                    </div>
                </div>
            </div>
        </m.section>
    );
}
