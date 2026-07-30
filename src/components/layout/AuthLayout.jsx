import React, { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthLayout() {
    const location = useLocation();
    
    // Generate random image only once per layout mount (or we could use memo to keep it stable)
    const [randomImageId] = useState(() => Math.floor(Math.random() * 7) + 1);
    const imageSrc = `/images/auth_0${randomImageId}.jpg`;

    const pageContent = useMemo(() => {
        switch (location.pathname) {
            case '/login':
                return {
                    title: <>Welcome to <br/><span className="text-primary-300">Blu's Bakery</span></>,
                    desc: "Discover the taste of freshly baked artisan bread, decadent pastries, and warm moments."
                };
            case '/register':
                return {
                    title: <>Join <br/><span className="text-primary-300">Blu's Bakery</span></>,
                    desc: "Create an account to start ordering delicious treats and exclusive artisan breads."
                };
            case '/verify-otp':
                return {
                    title: <>Secure <br/><span className="text-primary-300">Authentication</span></>,
                    desc: "Please verify your identity to access the delicious world of Blu's Bakery."
                };
            case '/forgot-password':
                return {
                    title: <>Forgot <br/><span className="text-primary-300">Password?</span></>,
                    desc: "Don't worry, we'll help you get back to enjoying our fresh artisan goods."
                };
            case '/reset-password':
                return {
                    title: <>Secure your <br/><span className="text-primary-300">Account</span></>,
                    desc: "Enter the code sent to your email along with your new password."
                };
            default:
                return {
                    title: <>Welcome to <br/><span className="text-primary-300">Blu's Bakery</span></>,
                    desc: "Discover the taste of freshly baked artisan bread, decadent pastries, and warm moments."
                };
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-zinc-50 relative w-full overflow-hidden font-sans text-zinc-900 antialiased selection:bg-primary-500/30 selection:text-primary-900">
            {/* Dynamic Background Patterns */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-100 overflow-hidden z-10 shadow-2xl">
                <img 
                    src={imageSrc} 
                    alt="Artisan bakery pastries" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[20s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/60 via-zinc-900/20 to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-20 flex flex-col justify-end p-16 h-full text-white w-full"
                    >
                        <div className="w-16 h-1 bg-primary-500 mb-6 rounded-full" />
                        <h2 className="text-5xl font-bold mb-6 tracking-tight font-outfit leading-tight">{pageContent.title}</h2>
                        <p className="text-xl text-zinc-100 max-w-md font-light leading-relaxed">{pageContent.desc}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right side - The Outlet renders the form wrapper and contents */}
            <Outlet />
        </div>
    );
}
