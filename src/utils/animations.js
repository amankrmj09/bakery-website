// Standard easing curves
export const easings = {
    standard: [0.4, 0, 0.2, 1],
    easeOut: "easeOut",
    easeIn: "easeIn",
    easeInOut: "easeInOut",
    linear: "linear"
};

// Standard durations
export const durations = {
    fast: 0.3,
    standard: 0.5,
    slow: 0.8,
    verySlow: 1.2
};

// Common animation variants
export const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (customDelay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.slow,
            delay: customDelay,
            ease: easings.easeOut
        }
    })
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: (customDelay = 0) => ({
        opacity: 1,
        transition: {
            duration: durations.slow,
            delay: customDelay,
            ease: easings.easeOut
        }
    })
};

export const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (customDelay = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: durations.slow,
            delay: customDelay,
            ease: easings.easeOut
        }
    })
};

export const slideInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: (customDelay = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: durations.slow,
            delay: customDelay,
            ease: easings.easeOut
        }
    })
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: (customDelay = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: durations.slow,
            delay: customDelay,
            ease: easings.easeOut
        }
    })
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

// Specific complex animations
export const sliderVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, zIndex: 1 },
    exit: { opacity: 0, zIndex: 0 },
};

export const sliderTransition = {
    duration: durations.slow,
    ease: easings.standard
};
