import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {fetchCategories, fetchProducts, fetchStorefront} from '../redux/shopThunk';
import ProductCard from '../components/ProductCard';
import {addItemToCart, fetchCart} from '../../cart/redux/cartThunk';
import api from '../../../lib/axios';
import {
  LuArrowRight as ArrowRight,
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
  LuCookingPot as CookingPot,
  LuHeadphones as HeadphonesIcon,
  LuPackageCheck as PackageCheck,
  LuStar as Star,
  LuTruck as Truck,
  LuShoppingCart as ShoppingCart
} from 'react-icons/lu';

// A mapping to dynamically render lucide icons if passed by name
const IconMap = {
  'CookingPot': CookingPot,
  'Truck': Truck,
  'PackageCheck': PackageCheck,
  'Delivery': Truck // Fallback
};

const CachedImage = ({ src, alt, className, fallbackSrc = '/images/placeholder_bakery.png', ...props }) => {
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

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {products, categories, storefront} = useSelector((state) => state.shop);
    const {cart} = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchStorefront());
    }, [dispatch]);

    const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('/api/v1/engagement/testimonials/featured');
                setFeaturedTestimonials(res.data || []);
            } catch (err) {
                console.error('Failed to load featured testimonials', err);
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (featuredTestimonials.length > 1) {
                setCurrentTestimonialIndex(i => (i + 1) % featuredTestimonials.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredTestimonials.length]);

    const activeTestimonial = featuredTestimonials[currentTestimonialIndex] || null;

    const handleAddToCart = async (product) => {
        try {
            let currentCartId = cart?.id;
            if (!currentCartId) {
                const newCart = await dispatch(fetchCart()).unwrap();
                currentCartId = newCart?.id;
            }
            if (!currentCartId) {
                toast.error('Unable to initialize cart');
                return;
            }
            await dispatch(addItemToCart({ cartId: currentCartId, productId: product.id, quantity: 1 })).unwrap();
            toast.success(`${product.name} added to cart`);
        } catch (error) {
            toast.error(`Failed to add ${product.name} to cart`);
        }
    };



    const getCategoryColor = (index) => {
        const colors = ['bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-pink-50'];
        return colors[index % colors.length];
    };

    const productList = products.data || [];
    const config = storefront.data;

    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);

    const topCategories = categories.data?.slice(0, 3) || [];
    const activeCategory = topCategories[activeTopCategoryIndex];

    const categoryProducts = activeCategory 
        ? productList.filter(p => p.categoryId === activeCategory.id || p.categoryName === activeCategory.name)
        : [];
        
    const topRatedProduct = categoryProducts.length > 0 
        ? [...categoryProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] 
        : null;

    const handlePrevCategory = () => {
        if (topCategories.length === 0) return;
        setActiveTopCategoryIndex(prev => (prev === 0 ? topCategories.length - 1 : prev - 1));
    };

    const handleNextCategory = () => {
        if (topCategories.length === 0) return;
        setActiveTopCategoryIndex(prev => (prev === topCategories.length - 1 ? 0 : prev + 1));
    };

    const campaigns = config?.heroSection?.campaigns?.length >= 3 ? config.heroSection.campaigns : [
      { largeImageUrl: '/images/campaign1_large.png', smallImageUrl: '/images/campaign1_small.png' },
      { largeImageUrl: '/images/campaign2_large.png', smallImageUrl: '/images/campaign2_small.png' },
      { largeImageUrl: '/images/campaign3_large.png', smallImageUrl: '/images/campaign3_small.png' }
    ];

    useEffect(() => {
        if (!campaigns || campaigns.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % campaigns.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [campaigns]);

    const about = config?.aboutSection || {
      tag: 'Savor the Flavor, Anytime, Anywhere',
      title: 'FRESH. DELICIOUS. DELIVERED!',
      description: "Welcome to your ultimate destination for mouthwatering meals and snacks delivered straight to your doorstep. We're passionate about bringing you the finest, freshest, and most delectable foods from around the globe.",
      image1Url: '/images/bakery_chef.png',
      image2Url: '/images/hero_croissant.png',
      image3Url: '/images/hero_cupcakes.png'
    };

    const offerImages = config?.specialOfferSection?.images || [];

    return (
        <div className="flex flex-col bg-background min-h-screen">

            {/* 1. HERO SECTION (Carousel) */}
            <section className="max-w-7xl mx-auto w-full px-6 py-4 lg:py-6">
                <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 lg:gap-6 h-[calc(100vh-140px)] min-h-[400px] max-h-[700px]">
                    {/* Main Hero Image (Left, 3:2 width ratio -> 3/5 width) */}
                    <div className="lg:col-span-3 rounded-[2rem] overflow-hidden relative shadow-md h-full w-full bg-muted/10">
                        <CachedImage 
                            key={`large-${activeIndex}`}
                            src={campaigns[activeIndex]?.largeImageUrl} 
                            alt="Campaign Main" 
                            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700"
                        />
                    </div>

                    {/* Side Images (Right, 2/5 width, 1:1 vertical split) */}
                    <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-6 h-full w-full">
                        <div className="flex-1 rounded-[2rem] relative overflow-hidden shadow-sm h-full w-full bg-muted/10">
                            <CachedImage 
                                key={`small1-${activeIndex}`}
                                src={campaigns[(activeIndex + 1) % campaigns.length]?.smallImageUrl} 
                                alt="Campaign Side 1" 
                                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700"
                            />
                        </div>

                        <div className="flex-1 rounded-[2rem] relative overflow-hidden shadow-sm h-full w-full bg-muted/10">
                            <CachedImage 
                                key={`small2-${activeIndex}`}
                                src={campaigns[(activeIndex + 2) % campaigns.length]?.smallImageUrl} 
                                alt="Campaign Side 2" 
                                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. NEW PRODUCTS SHOWCASE (Colored Cards) */}
            <section className="max-w-7xl mx-auto w-full px-6 py-16">
                <div className="text-center mb-10">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">New Menu</span>
                    <h2 className="text-4xl font-extrabold text-[#eab308] mt-2">Our Fresh Arrivals</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productList.slice(0, 4).map((product, idx) => {
                        const cardColors = ['bg-primary-500', 'bg-[#eab308]', 'bg-red-500', 'bg-green-500'];
                        const colorClass = cardColors[idx % cardColors.length];
                        return (
                            <div key={product.id}
                                 className={`${colorClass} rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between group`}>
                                <div className="z-10 text-white w-2/3">
                                    {product.categoryName && <span className="text-white/80 font-semibold text-sm uppercase">{product.categoryName}</span>}
                                    <h3 className="text-2xl font-bold leading-tight mt-1 mb-2">{product.name}</h3>
                                </div>

                                {product.status !== 'ACTIVE' ? (
                                    <div className="absolute top-6 right-6 z-20 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide backdrop-blur-md">
                                        Unavailable
                                    </div>
                                ) : product.inventory?.isOutOfStock ? (
                                    <div className="absolute top-6 right-6 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                                        Out of Stock
                                    </div>
                                ) : product.inventory?.isLowStock ? (
                                    <div className="absolute top-6 right-6 z-20 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                                        Limited Stock
                                    </div>
                                ) : null}

                                <CachedImage
                                    src={product.primaryImageUrl || product.mediaUrls?.[0]}
                                    alt={product.name}
                                    className="absolute -bottom-4 -right-4 h-[70%] w-[70%] object-cover rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-500 border-4 border-white/20"
                                />

                                <button onClick={async () => {
                                            if (!user) {
                                                toast.error("You must login before checking out");
                                                navigate('/login');
                                                return;
                                            }
                                            await handleAddToCart(product);
                                            navigate('/checkout');
                                        }}
                                        disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock}
                                        className="z-10 text-white font-medium text-sm flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-5 py-2 group/btn mt-auto self-start disabled:opacity-50 disabled:cursor-not-allowed border border-white/20">
                                    Order Now <ArrowRight
                                    className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 4. TOP CATEGORIES & HORIZONTAL CAROUSEL */}
            <section className="bg-card py-16">
                <div className="max-w-7xl mx-auto w-full px-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-2">
                            <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground"/></span>
                            <h2 className="text-2xl font-bold text-foreground">Top Categories</h2>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handlePrevCategory}
                                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                                <ChevronLeft className="w-5 h-5"/></button>
                            <button
                                onClick={handleNextCategory}
                                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                                <ChevronRight className="w-5 h-5"/></button>
                        </div>
                    </div>

                    {activeCategory ? (
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-background border border-border rounded-[2rem] p-8 shadow-sm">
                            <div className="flex flex-col items-center md:items-start flex-1">
                                <div
                                    className={`w-32 h-32 rounded-full ${getCategoryColor(activeTopCategoryIndex)} flex items-center justify-center mb-6 overflow-hidden p-4 shadow-inner`}>
                                    <CachedImage
                                        src={activeCategory.mediaUrls?.[0]}
                                        alt={activeCategory.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <h3 className="text-3xl font-extrabold text-foreground mb-2">{activeCategory.name}</h3>
                                <p className="text-muted-foreground mb-6 text-center md:text-left max-w-sm">
                                    Explore our delicious selection of {activeCategory.name}. Crafted with the finest ingredients and baked to perfection.
                                </p>
                            </div>
                            
                            <div className="flex-1 w-full max-w-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[#eab308] font-bold text-sm tracking-wider uppercase text-center md:text-left">Top Rated in {activeCategory.name}</h4>
                                </div>
                                {topRatedProduct ? (
                                    <ProductCard product={topRatedProduct} />
                                ) : (
                                    <div className="p-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                                        No products available in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 border border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm bg-background">
                            No top categories available.
                        </div>
                    )}

                    <div className="mt-16 text-center mb-10">
                        <span
                            className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">Customer Favorites</span>
                        <h2 className="text-4xl font-extrabold text-[#eab308] mt-2">Our Most Loved Sweets</h2>
                    </div>

                    <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar">
                        {productList.slice(0, 5).map(product => (
                            <ProductCard key={product.id} product={product} className="min-w-[280px] w-[280px] max-w-[280px] flex-shrink-0" />
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. ABOUT US & HOW WE WORK */}
            <section className="bg-background py-16">
                <div className="max-w-7xl mx-auto w-full px-6">
                    <div className="flex items-center space-x-2 mb-8">
                        <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground"/></span>
                        <h2 className="text-2xl font-bold text-foreground">Little Bite About Us</h2>
                    </div>

                    <div
                        className="bg-card border border-border rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mb-20">
                        <div className="md:w-1/2 z-10 pr-8">
                            <h3 className="text-foreground font-bold mb-2">{about.tag}</h3>
                            <h2 className="text-5xl font-black text-green-500 leading-tight mb-6">{about.title}</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-md">
                                {about.description}
                            </p>
                            <Link to="/shop"
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-500/30">
                                Explore More
                            </Link>
                        </div>
                        <div className="md:w-1/2 h-full flex justify-end mt-8 md:mt-0 relative">
                            <CachedImage src={about.image1Url} alt="About main"
                                 className="h-[400px] object-contain drop-shadow-2xl z-10"/>
                            <CachedImage src={about.image2Url} alt="About floating 1"
                                 className="absolute left-0 bottom-10 h-24 object-contain animate-bounce drop-shadow-xl"/>
                            <CachedImage src={about.image3Url} alt="About floating 2"
                                 className="absolute right-0 top-10 h-24 object-contain animate-pulse drop-shadow-xl"/>
                        </div>
                    </div>


                </div>
            </section>

            {/* 6. SPECIAL OFFER */}
            {offerImages.length > 0 && (
                <section className="bg-background py-8 lg:py-16">
                    <div className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-6">
                        {offerImages.map((imgUrl, idx) => (
                            <div key={idx} className="w-full overflow-hidden rounded-2xl shadow-lg border border-border/40 hover:shadow-xl transition-shadow aspect-[4/1]">
                                <CachedImage src={imgUrl} alt={`Special Offer ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 7. TESTIMONIALS */}
            {activeTestimonial && (
            <section className="bg-card py-16">
                <div className="max-w-7xl mx-auto w-full px-6">
                    <div className="text-center mb-10">
                        <span className="text-[#eab308] font-bold tracking-wider text-sm uppercase">Feedbacks</span>
                        <h2 className="text-3xl font-extrabold text-foreground mt-2">What Our Customers Says</h2>
                    </div>

                    <div className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-lg transition-opacity duration-500">
                        <div className="md:w-1/2 bg-red-600 p-12 flex items-center justify-center">
                            <div className="bg-white rounded-3xl p-8 relative max-w-sm w-full shadow-xl">
                                <div
                                    className="absolute -top-6 left-8 text-6xl text-red-600 font-serif leading-none">"
                                </div>
                                <h4 className="font-bold text-red-600 text-lg mb-4 mt-2">Fantastic Experience!</h4>
                                <p className="text-sm text-foreground/80 mb-6 italic leading-relaxed min-h-[80px]">
                                    "{activeTestimonial.message}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center text-primary font-bold shadow-inner">
                                            {activeTestimonial.profileImageUrl ? (
                                                <CachedImage src={activeTestimonial.profileImageUrl} alt={activeTestimonial.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{activeTestimonial.name ? activeTestimonial.name.substring(0,2).toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-sm">{activeTestimonial.name || 'Anonymous User'}</span>
                                    </div>
                                    <div className="flex text-[#eab308]">
                                        {[...Array(activeTestimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                                    </div>
                                </div>
                                {featuredTestimonials.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-60">
                                        {featuredTestimonials.map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentTestimonialIndex ? 'bg-red-600 w-3' : 'bg-gray-300'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            <CachedImage src="/images/bakery_customers.png" alt="Happy Customers"
                                 className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
            </section>
            )}


        </div>
    );
}

// Inline helper component
function ShoppingCartIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
    );
}








