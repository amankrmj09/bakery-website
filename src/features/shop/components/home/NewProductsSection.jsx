import React from 'react';
import { motion } from 'framer-motion';
import { ShowcaseCard } from '../../../../components/ui/ShowcaseCard';

export function NewProductsSection({ productList }) {

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
            className="max-w-7xl mx-auto w-full px-6 py-16"
        >
            <div className="text-center mb-10">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">Seasonal Offerings</span>
                <h2 className="text-4xl font-extrabold font-serif text-[#eab308] mt-2">Freshly Baked Arrivals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {productList.slice(0, 4).map((product, idx) => (
                    <ShowcaseCard key={product.id} product={product} idx={idx} />
                ))}
            </div>
        </motion.section>
    );
}
