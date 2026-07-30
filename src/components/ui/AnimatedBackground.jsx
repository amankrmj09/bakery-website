import React from 'react';
import { m } from 'framer-motion';
import { GiCroissant, GiPretzel, GiCupcake, GiCakeSlice, GiCoffeeCup, GiDonut, GiCookie, GiPieSlice } from 'react-icons/gi';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#fdf8f5]">
            <m.div 
                className="absolute top-[10%] left-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '110vw'], y: [0, 50, -50, 0], rotate: [0, 360] }} 
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: 10, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiCroissant className="text-[#d97706] opacity-30 w-16 h-16 md:w-24 md:h-24 cursor-pointer" />
                </m.div>
            </m.div>
            
            <m.div 
                className="absolute top-[35%] right-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '-110vw'], y: [0, -60, 60, 0], rotate: [0, -360] }} 
                transition={{ repeat: Infinity, duration: 30, ease: "linear", delay: 2 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: -15, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiDonut className="text-[#d97706] opacity-30 w-16 h-16 md:w-20 md:h-20 cursor-pointer" />
                </m.div>
            </m.div>

            <m.div 
                className="absolute top-[70%] left-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '110vw'], y: [0, 30, -30, 0], rotate: [0, 180] }} 
                transition={{ repeat: Infinity, duration: 28, ease: "linear", delay: 5 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: 10, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiCoffeeCup className="text-[#d97706] opacity-30 w-12 h-12 md:w-20 md:h-20 cursor-pointer" />
                </m.div>
            </m.div>

            <m.div 
                className="absolute top-[20%] right-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '-110vw'], y: [0, -40, 40, 0], rotate: [0, -180] }} 
                transition={{ repeat: Infinity, duration: 22, ease: "linear", delay: 1 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: -10, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiCupcake className="text-[#d97706] opacity-30 w-14 h-14 md:w-20 md:h-20 cursor-pointer" />
                </m.div>
            </m.div>

            <m.div 
                className="absolute top-[60%] left-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '110vw'], y: [0, -50, 50, 0], rotate: [0, 270] }} 
                transition={{ repeat: Infinity, duration: 32, ease: "linear", delay: 4 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: 15, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiPretzel className="text-[#d97706] opacity-30 w-16 h-16 md:w-24 md:h-24 cursor-pointer" />
                </m.div>
            </m.div>

            <m.div 
                className="absolute top-[85%] right-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '-110vw'], y: [0, 40, -40, 0], rotate: [0, -270] }} 
                transition={{ repeat: Infinity, duration: 26, ease: "linear", delay: 3 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: -15, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiCakeSlice className="text-[#d97706] opacity-30 w-14 h-14 md:w-20 md:h-20 cursor-pointer" />
                </m.div>
            </m.div>

            {/* New Icons */}
            <m.div 
                className="absolute top-[15%] left-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '110vw'], y: [0, 40, -40, 0], rotate: [0, 180] }} 
                transition={{ repeat: Infinity, duration: 27, ease: "linear", delay: 6 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: 20, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiCookie className="text-[#d97706] opacity-30 w-14 h-14 md:w-16 md:h-16 cursor-pointer" />
                </m.div>
            </m.div>

            <m.div 
                className="absolute top-[75%] right-[-10%] pointer-events-auto" 
                animate={{ x: ['0vw', '-110vw'], y: [0, -45, 45, 0], rotate: [0, -200] }} 
                transition={{ repeat: Infinity, duration: 35, ease: "linear", delay: 8 }}
            >
                <m.div whileHover={{ scale: 1.25, rotate: -20, y: -10 }} transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}>
                    <GiPieSlice className="text-[#d97706] opacity-30 w-14 h-14 md:w-20 md:h-20 cursor-pointer" />
                </m.div>
            </m.div>
        </div>
    );
}
