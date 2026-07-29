import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuStar as Star } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';

export function TestimonialsSection({ activeTestimonial, currentTestimonialIndex, featuredTestimonials }) {
    if (!activeTestimonial) return null;

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    return (
        <motion.section 
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="bg-card py-16"
        >
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="text-center mb-10">
                    <span className="text-[#eab308] font-bold tracking-wider text-sm uppercase">Client Testimonials</span>
                    <h2 className="text-3xl font-extrabold font-serif text-foreground mt-2">Words From Our Guests</h2>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentTestimonialIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-lg transition-opacity duration-500"
                    >
                        <div className="md:w-1/2 bg-red-600 p-12 flex items-center justify-center">
                            <div className="bg-white rounded-3xl p-8 relative max-w-sm w-full shadow-xl">
                                <div
                                    className="absolute -top-6 left-8 text-6xl text-red-600 font-serif leading-none">"
                                </div>
                                <h4 className="font-bold text-red-600 text-lg mb-4 mt-2">Fantastic Experience!</h4>
                                <p className="text-sm text-foreground/80 mb-6 italic leading-relaxed min-h-[80px]">
                                    "{activeTestimonial.message}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center text-primary font-bold shadow-inner">
                                            {activeTestimonial.profileImageUrl ? (
                                                <CachedImage src={activeTestimonial.profileImageUrl} alt={activeTestimonial.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{activeTestimonial.name ? activeTestimonial.name.substring(0,2).toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-sm">{activeTestimonial.name || 'Anonymous User'}</span>
                                    </div>
                                    <div className="flex text-[#eab308]">
                                        {[...Array(activeTestimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                                    </div>
                                </div>
                                {featuredTestimonials?.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-60">
                                        {featuredTestimonials.map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentTestimonialIndex ? 'bg-red-600 w-3' : 'bg-gray-300'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 relative min-h-[300px]">
                            <CachedImage src="/images/bakery_customers.png" alt="Happy Customers"
                                 className="w-full h-full object-cover"/>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
