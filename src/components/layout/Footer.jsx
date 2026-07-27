import React from 'react';
import { Link } from 'react-router-dom';
import { LuPackageCheck as PackageCheck, LuHeadphones as HeadphonesIcon, LuStar as Star } from 'react-icons/lu';

export default function Footer() {
    return (
        <footer className="bg-[#fcfaf7] border-t border-border pt-12">
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
                            <p>Blu Food Court</p>
                            <p>Blu's Bakery LLC</p>
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

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Follow Us</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary-500 flex items-center">Instagram</a></li>
                            <li><a href="#" className="hover:text-primary-500 flex items-center">Facebook</a></li>
                            <li><a href="#" className="hover:text-primary-500 flex items-center">Twitter</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between py-6 text-sm text-muted-foreground">
                    <p>© 2026 Blubug Tech. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="/terms" className="hover:text-primary-500">Terms & Conditions</Link>
                        <Link to="/privacy" className="hover:text-primary-500">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
