import React, { useState, useEffect } from 'react';

export const CachedImage = ({ src, alt, className, fallbackSrc = '/images/placeholder_bakery.png', ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        let isMounted = true;
        if (!src) {
            if (isMounted) {
                setImgSrc(fallbackSrc);
                setLoaded(true);
            }
            return;
        }

        const img = new Image();
        img.src = src;
        img.onload = () => {
            if (isMounted) {
                setLoaded(true);
                setImgSrc(src);
            }
        };
        img.onerror = () => {
            if (isMounted) {
                setImgSrc(fallbackSrc);
                setLoaded(true);
            }
        };

        return () => {
            isMounted = false;
        };
    }, [src, fallbackSrc]);

    const finalSrc = imgSrc || src || fallbackSrc;
    const safeSrc = finalSrc === "" ? null : finalSrc;

    return (
        <>
            {!loaded && (
                <div className={`animate-pulse bg-muted/30 ${className || ''}`} />
            )}
            <img 
                src={safeSrc} 
                alt={alt} 
                className={`${className || ''} ${!loaded ? 'hidden' : ''}`} 
                {...props} 
            />
        </>
    );
};
