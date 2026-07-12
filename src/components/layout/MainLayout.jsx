import React, {useEffect} from 'react';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {LogOut, Search, ShoppingBag} from 'lucide-react';
import {logout} from '../../features/auth/redux/authThunk';
import {fetchCart} from '../../features/cart/redux/cartThunk';

export default function MainLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useSelector(state => state.auth);
    const {cart} = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const cartItemCount = cart?.totalQuantity || 0;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
            {/* Top Navigation - GOOD FOOD Style */}
            <header
                className="flex h-20 items-center justify-between bg-card border-b border-border px-8 shadow-sm flex-shrink-0 z-10 w-full">

                {/* Logo Left */}
                <Link to="/" className="flex items-center space-x-3">
                    <img src="/images/blubug_logo.png" alt="Blubug Logo"
                         className="h-10 w-auto object-contain mix-blend-multiply"/>
                    <span className="text-xl font-extrabold text-foreground tracking-tight">
            Blu Bakery
          </span>
                </Link>

                {/* Center Nav Links */}
                <nav className="hidden md:flex items-center space-x-8 font-semibold text-sm">
                    <Link to="/"
                          className={`relative pb-1 ${location.pathname === '/' ? 'text-primary-500' : 'text-foreground hover:text-primary-500 transition-colors'}`}>
                        Home
                        {location.pathname === '/' &&
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full"/>}
                    </Link>
                    <Link to="/shop"
                          className={`flex items-center space-x-1 ${location.pathname.startsWith('/shop') ? 'text-primary-500' : 'text-foreground hover:text-primary-500 transition-colors'}`}>
                        <span>Menu</span>
                    </Link>
                    <Link to="/contact"
                          className={`text-foreground hover:text-primary-500 transition-colors ${location.pathname === '/contact' ? 'text-primary-500 font-bold' : ''}`}>
                        Contact
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-6">
                    <button className="text-foreground hover:text-primary-500 transition-colors">
                        <Search className="w-5 h-5"/>
                    </button>

                    <Link to="/cart" className="relative text-foreground hover:text-primary-500 transition-colors">
                        <ShoppingBag className="w-5 h-5"/>
                        {cartItemCount > 0 && (
                            <span
                                className="absolute -top-2 -right-2 h-4 w-4 bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-card">
                {cartItemCount}
              </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-3 border-l border-border pl-6">
                            <Link to="/profile" className="flex items-center space-x-2 group">
                                <div
                                    className="h-9 w-9 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 font-bold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                    {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                </div>
                            </Link>
                            <button
                                onClick={() => dispatch(logout())}
                                className="p-2 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5"/>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login"
                              className="bg-primary-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors shadow-sm text-sm">
                            Login
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full bg-background relative overflow-y-auto">
                <Outlet/>
            </main>
        </div>
    );
}
