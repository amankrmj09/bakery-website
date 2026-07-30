import React from 'react';
import { m } from 'framer-motion';
import { fadeInUp, fadeIn, scaleUp, slideInRight, slideInLeft } from '../../utils/animations';

const variantsMap = {
    fadeInUp,
    fadeIn,
    scaleUp,
    slideInRight,
    slideInLeft
};

export const FadeIn = ({ 
    children, 
    delay = 0, 
    variant = 'fadeInUp', 
    className = '',
    viewport = { once: true, margin: "-100px" } 
}) => {
    const selectedVariant = variantsMap[variant] || fadeInUp;

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            custom={delay}
            variants={selectedVariant}
            viewport={viewport}
            className={className}
        >
            {children}
        </m.div>
    );
};
