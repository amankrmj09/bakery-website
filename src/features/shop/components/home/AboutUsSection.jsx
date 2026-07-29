import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuStar as Star } from 'react-icons/lu';
import { CachedImage } from '../../../../components/ui/CachedImage';

export function AboutUsSection({ about }) {
    if (!about || (!about.title && !about.tag && !about.description)) return null;

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
            className="bg-background py-16"
        >
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="flex items-center space-x-2 mb-8">
                    <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground"/></span>
                    <h2 className="text-2xl font-bold font-serif text-foreground">Our Story</h2>
                </div>

                <div
                    className="bg-card border border-border rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mb-20">
                    <div className="md:w-1/2 z-10 pr-8">
                        <h3 className="text-foreground font-bold mb-2">{about.tag}</h3>
                        <h2 className="text-5xl font-black font-serif text-green-500 leading-tight mb-6">{about.title}</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-md">
                            {about.description}
                        </p>
                        <Link to="/shop"
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-500/30">
                            Explore More
                        </Link>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 relative min-h-[400px] md:min-h-[500px] flex items-center justify-center">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-[30%_35%_25%_40%/35%_25%_40%_30%] overflow-hidden shadow-2xl"
                        >
                            <CachedImage src={about.image1Url} alt="About main"
                                 className="w-full h-full object-cover"/>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="absolute left-2 md:-left-8 bottom-8 z-20"
                        >
                            <motion.div 
                                animate={{ y: [0, -10, 0], rotate: [-4, -8, -4] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="w-36 h-36 md:w-48 md:h-48 shadow-2xl rounded-[25%_35%_40%_30%/30%_40%_25%_35%] overflow-hidden"
                            >
                                <CachedImage src={about.image2Url} alt="About floating 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute right-2 md:-right-4 top-8 z-20"
                        >
                            <motion.div 
                                animate={{ y: [0, 10, 0], rotate: [4, 8, 4] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="w-32 h-32 md:w-44 md:h-44 shadow-2xl rounded-[35%_25%_30%_40%/40%_30%_35%_25%] overflow-hidden"
                            >
                                <CachedImage src={about.image3Url} alt="About floating 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
