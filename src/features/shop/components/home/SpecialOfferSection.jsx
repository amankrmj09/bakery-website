import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LuCopy as CopyIcon } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';

export function SpecialOfferSection({ offers }) {
    if (!offers || offers.length === 0) return null;

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
            className="bg-background py-8 lg:py-16"
        >
            <div className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-6">
                {offers.map((offer, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="w-full overflow-hidden rounded-2xl shadow-lg border border-border/40 hover:shadow-xl transition-shadow aspect-[4/1] relative group"
                    >
                        <CachedImage src={offer.imageUrl} alt={offer.title || `Special Offer ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {(offer.title || offer.description) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col items-start justify-center p-8 md:p-12 transition-all duration-500 group-hover:bg-black/20">
                                <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                                    {offer.title && <h3 className="text-3xl md:text-4xl font-bold font-serif mb-3 text-white drop-shadow-lg">{offer.title}</h3>}
                                    {offer.description && <p className="text-base md:text-lg max-w-md text-white/90 drop-shadow-md font-medium leading-relaxed">{offer.description}</p>}
                                    {(offer.code || offer.couponCode || offer.discountCode) && (() => {
                                        const code = offer.code || offer.couponCode || offer.discountCode;
                                        return (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigator.clipboard.writeText(code);
                                                    toast.success(`Coupon code '${code}' copied!`);
                                                }}
                                                className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-primary-500/90 hover:bg-primary-600 text-white text-sm font-bold rounded-xl backdrop-blur-sm transition-colors border border-primary-400/50 shadow-lg"
                                            >
                                                <span>Use Code: {code}</span>
                                                <CopyIcon className="w-4 h-4" />
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
