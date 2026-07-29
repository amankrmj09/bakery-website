import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CachedImage } from '../../../../components/ui/CachedImage';

export function HeroSection({ campaigns }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!campaigns || campaigns.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % campaigns.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [campaigns]);

    return (
        <section className="w-full bg-background relative" style={{ height: 'calc(100dvh - 80px)' }}>
            <div className="w-full h-full flex flex-row gap-4 lg:gap-6 px-4 lg:px-8 py-4 lg:py-6 relative z-10">
                <div className="flex-1 sm:flex-[3] relative rounded-[2rem] bg-muted/10">
                    <AnimatePresence>
                        {campaigns?.length > 0 && (
                            <motion.div
                                key={`campaign-${activeIndex}`}
                                layoutId={`campaign-image-${activeIndex}`}
                                initial={{ opacity: 0, zIndex: 10 }}
                                animate={{ opacity: 1, zIndex: 30 }}
                                exit={{ opacity: 0, zIndex: 0 }}
                                transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
                                className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-md"
                            >
                                <CachedImage 
                                    src={campaigns[activeIndex]?.imageUrl} 
                                    alt="Campaign Main" 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="hidden sm:flex flex-[2] flex-col gap-4 lg:gap-6">
                    <div className="flex-1 relative rounded-[2rem] bg-muted/10">
                        <AnimatePresence>
                            {campaigns?.length > 0 && (
                                <motion.div
                                    key={`campaign-${(activeIndex + 1) % campaigns.length}`}
                                    layoutId={`campaign-image-${(activeIndex + 1) % campaigns.length}`}
                                    initial={{ opacity: 0, scale: 0.8, zIndex: 10 }}
                                    animate={{ opacity: 1, scale: 1, zIndex: 20 }}
                                    exit={{ opacity: 0, zIndex: 0 }}
                                    transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
                                    className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-sm"
                                >
                                    <CachedImage 
                                        src={campaigns[(activeIndex + 1) % campaigns.length]?.imageUrl} 
                                        alt="Campaign Side 1" 
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 relative rounded-[2rem] bg-muted/10">
                        <AnimatePresence>
                            {campaigns?.length > 0 && (
                                <motion.div
                                    key={`campaign-${(activeIndex + 2) % campaigns.length}`}
                                    layoutId={`campaign-image-${(activeIndex + 2) % campaigns.length}`}
                                    initial={{ opacity: 0, scale: 0.8, zIndex: 0 }}
                                    animate={{ opacity: 1, scale: 1, zIndex: 10 }}
                                    exit={{ opacity: 0, zIndex: 0 }}
                                    transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
                                    className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-sm"
                                >
                                    <CachedImage 
                                        src={campaigns[(activeIndex + 2) % campaigns.length]?.imageUrl} 
                                        alt="Campaign Side 2" 
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
