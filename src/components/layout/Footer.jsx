import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPackageCheck as PackageCheck, LuHeadphones as HeadphonesIcon, LuStar as Star } from 'react-icons/lu';
import api from '../../lib/axios';

// Social platform icon components (inline SVG for zero-dependency)
const InstagramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const FacebookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const TwitterXIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const ThreadsIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 192 192" fill="currentColor">
        <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C57.013 24.425 74.264 17.11 97.073 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.213 0h-.38C69.031.195 47.395 9.642 32.76 28.086 19.883 44.487 13.224 67.315 13.001 96c.223 28.685 6.882 51.512 19.76 67.914C47.395 182.358 69.031 191.805 96.833 192h.38c24.546-.17 41.525-6.6 55.7-20.761 18.786-18.774 18.215-42.097 12.023-56.47-4.573-10.652-13.32-19.386-23.399-25.781zM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.286-15.746 22.462-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.785-1.978 24.702-13.754 28.713-23.803 29.254z"/>
    </svg>
);

const SOCIAL_PLATFORMS = [
    {
        key: 'instagram',
        label: 'Instagram',
        Icon: InstagramIcon,
        color: 'hover:text-pink-500',
        hoverBg: 'hover:bg-pink-50',
    },
    {
        key: 'facebook',
        label: 'Facebook',
        Icon: FacebookIcon,
        color: 'hover:text-blue-600',
        hoverBg: 'hover:bg-blue-50',
    },
    {
        key: 'twitter',
        label: 'Twitter / X',
        Icon: TwitterXIcon,
        color: 'hover:text-gray-900',
        hoverBg: 'hover:bg-gray-100',
    },
    {
        key: 'threads',
        label: 'Threads',
        Icon: ThreadsIcon,
        color: 'hover:text-gray-800',
        hoverBg: 'hover:bg-gray-100',
    },
];

export default function Footer() {
    const [socialLinks, setSocialLinks] = useState({});

    useEffect(() => {
        api.get('/api/v1/engagement/contact-details')
            .then(res => {
                setSocialLinks(res.data?.socialLinks || {});
            })
            .catch(() => {
                // Silently fail — footer remains visible without social links
            });
    }, []);

    const activeSocialLinks = SOCIAL_PLATFORMS.filter(p => socialLinks[p.key]?.trim());

    return (
        <footer className="relative z-10 bg-[#fcfaf7] border-t border-border pt-12">
            <div className="max-w-7xl mx-auto w-full px-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-[#fdf0d5] rounded-2xl p-8 mb-12 border border-[#f5e1b8]">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm">
                            <PackageCheck className="w-6 h-6"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Free Shipping</h4>
                            <p className="text-xs text-muted-foreground">Free Shipping On All IND</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm">
                            <HeadphonesIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Money Returns</h4>
                            <p className="text-xs text-muted-foreground">Return it Within 30 Days</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm">
                            <Star className="w-6 h-6"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Secure Payments</h4>
                            <p className="text-xs text-muted-foreground">We Ensure Secure Payment</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm">
                            <HeadphonesIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Support 24/7</h4>
                            <p className="text-xs text-muted-foreground">Contact Us 24 Hours A Day</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-border">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <img src="/icon-192.png" alt="Blubug Logo" className="h-12 w-auto object-contain mix-blend-multiply"/>
                            <span className="text-2xl font-extrabold text-foreground tracking-tight">
                                Blu's Bakery
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
                            Your favorite freshly baked goods delivered to your door! From artisanal breads to
                            custom cakes, we have it all. Order easily and enjoy hassle-free!
                        </p>
                        <div className="text-xs text-muted-foreground">
                            <a 
                                href={socialLinks.website || "https://blubugtech.com"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-primary-500 transition-colors"
                            >
                                BluBugTech
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/contact" className="hover:text-primary-500">About Us</Link></li>
                            <li><Link to="/shop" className="hover:text-primary-500">Store</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-500">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary-500">Delivery</a></li>
                            <li><a href="#" className="hover:text-primary-500">Payments</a></li>
                            <li><Link to="/contact" className="hover:text-primary-500">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Follow Us — dynamically populated from admin config */}
                    <div>
                        <h4 className="font-bold text-foreground mb-4">Follow Us</h4>
                        {activeSocialLinks.length > 0 ? (
                            <ul className="space-y-3">
                                {activeSocialLinks.map(({ key, label, Icon, color, hoverBg }) => (
                                    <li key={key}>
                                        <a
                                            href={socialLinks[key]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2.5 text-sm text-muted-foreground transition-colors ${color} group`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center bg-muted/40 transition-colors ${hoverBg}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                            </span>
                                            <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground/50 italic">Coming soon</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between py-6 text-sm text-muted-foreground">
                    <p>© 2026 Blubug Tech. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="/terms" className="hover:text-primary-500">Terms &amp; Conditions</Link>
                        <Link to="/privacy" className="hover:text-primary-500">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
