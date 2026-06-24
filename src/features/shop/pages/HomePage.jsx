import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../redux/shopThunk';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { Star, ArrowRight, Plus, ChevronRight, ChevronLeft, Truck, PackageCheck, CookingPot, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((state) => state.shop);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    if (!cart?.id) return;
    dispatch(addItemToCart({ cartId: cart.id, productId, quantity: 1 }));
  };

  const getCategoryColor = (index) => {
    const colors = ['bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-pink-50'];
    return colors[index % colors.length];
  };

  const productList = products.data || [];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Card (Yellow) */}
          <div className="lg:col-span-8 bg-[#eab308] rounded-[2rem] p-10 flex items-center justify-between overflow-hidden relative shadow-md">
            <div className="z-10 text-white max-w-sm">
              <span className="text-red-500 font-bold uppercase tracking-wider text-sm mb-4 block">Artisanal Bakery</span>
              <h1 className="text-5xl font-extrabold leading-tight mb-4">
                FRESH, SWEET &<br/>TASTY
              </h1>
              <p className="text-white/80 mb-8 font-medium">Sale 20% every Monday</p>
              <Link to="/shop" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-red-500/30">
                Shop Now
              </Link>
            </div>
            {/* The giant floating burger */}
            <img src="/images/hero_burger.png" alt="Delicious Burger" className="absolute -right-20 top-1/2 -translate-y-1/2 h-[120%] object-contain drop-shadow-2xl" />
          </div>

          {/* Side Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#f0e8dc] rounded-[2rem] p-6 flex-1 flex relative overflow-hidden shadow-sm">
              <div className="z-10 flex flex-col justify-end w-1/2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Freshly Baked</span>
                <h3 className="text-xl font-bold text-foreground">Signature Cake</h3>
                <span className="text-primary-500 font-extrabold text-lg">$24.50</span>
              </div>
              <img src="/images/hero_cake.png" alt="Signature Cake" className="absolute -right-8 -top-8 h-[140%] object-contain drop-shadow-lg" />
            </div>
            
            <div className="bg-[#3e2723] rounded-[2rem] p-8 flex-1 flex items-center justify-center relative overflow-hidden shadow-sm">
              <div className="z-10 text-white w-full">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Sweet Treat</span>
                <h3 className="text-xl font-bold mb-4">Vanilla Cupcakes</h3>
                <img src="/images/hero_cupcakes.png" alt="Vanilla Cupcakes" className="absolute -right-4 -bottom-6 w-3/5 object-contain drop-shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 3. NEW PRODUCTS SHOWCASE (Colored Cards) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.slice(0, 4).map((product, idx) => {
            const cardColors = ['bg-primary-500', 'bg-[#eab308]', 'bg-red-500', 'bg-green-500'];
            const colorClass = cardColors[idx % cardColors.length];
            return (
              <div key={product.id} className={`${colorClass} rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between group`}>
                <div className="z-10 text-white w-2/3">
                  <span className="text-white/80 font-semibold text-sm uppercase">{product.categoryName || 'New Menu'}</span>
                  <h3 className="text-2xl font-bold leading-tight mt-1 mb-2">{product.name}</h3>
                </div>
                
                <img 
                  src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                  alt={product.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                  className="absolute -bottom-8 -right-8 h-[75%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" 
                />
                
                <button onClick={() => handleAddToCart(product.id)} className="z-10 text-white font-medium text-sm flex items-center group/btn mt-auto self-start">
                  Order Now <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
              <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground" /></span>
              <h2 className="text-2xl font-bold text-foreground">Top Categories</h2>
            </div>
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-6 no-scrollbar">
            {categories.data?.map((cat, idx) => (
              <div key={cat.id} className="flex flex-col items-center min-w-[100px] p-4 rounded-2xl bg-background border border-border hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-16 h-16 rounded-full ${getCategoryColor(idx)} flex items-center justify-center mb-3 overflow-hidden p-2`}>
                   <img 
                     src={cat.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                     alt={cat.name} 
                     className="w-full h-full object-contain" 
                   />
                </div>
                <h4 className="font-bold text-foreground text-center mb-1">{cat.name}</h4>
                <span className="text-xs text-muted-foreground mt-1">Products</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center mb-10">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">Collection</span>
            <h2 className="text-4xl font-extrabold text-[#eab308] mt-2">New Products</h2>
          </div>

          <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar">
            {productList.map(product => (
              <div key={product.id} className="min-w-[280px] bg-background border border-border rounded-[2rem] p-4 flex flex-col hover:shadow-xl transition-all duration-300">
                <div className="h-40 bg-muted/30 rounded-2xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                    alt={product.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="px-2 flex-1 flex flex-col">
                  <div className="flex items-center text-[#eab308] mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <h3 className="font-bold text-foreground text-lg leading-tight mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {product.description || 'Delicious ingredients, fresh taste.'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-extrabold text-lg text-red-500">${product.price?.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-[#eab308] hover:bg-yellow-500 text-white font-bold text-sm px-4 py-2 rounded-xl flex items-center transition-colors"
                    >
                      ADD TO CART <ShoppingCartIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ABOUT US & HOW WE WORK */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="flex items-center space-x-2 mb-8">
            <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground" /></span>
            <h2 className="text-2xl font-bold text-foreground">Little Bite About Us</h2>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mb-20">
            <div className="md:w-1/2 z-10 pr-8">
              <h3 className="text-foreground font-bold mb-2">Savor the Flavor, Anytime, Anywhere</h3>
              <h2 className="text-5xl font-black text-green-500 leading-tight mb-6">FRESH. DELICIOUS. DELIVERED!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-md">
                Welcome to your ultimate destination for mouthwatering meals and snacks delivered straight to your doorstep. We're passionate about bringing you the finest, freshest, and most delectable foods from around the globe.
              </p>
              <Link to="/shop" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-green-500/30">
                Explore More
              </Link>
            </div>
            <div className="md:w-1/2 h-full flex justify-end mt-8 md:mt-0 relative">
               <img src="/images/bakery_chef.png" alt="Chef" className="h-[400px] object-contain drop-shadow-2xl z-10" />
               <img src="/images/hero_croissant.png" alt="Floating Croissant" className="absolute left-0 bottom-10 h-24 object-contain animate-bounce drop-shadow-xl" />
               <img src="/images/hero_cupcakes.png" alt="Floating Cupcakes" className="absolute right-0 top-10 h-24 object-contain animate-pulse drop-shadow-xl" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-12">
            <span className="bg-muted p-2 rounded-lg"><Star className="w-5 h-5 text-foreground" /></span>
            <h2 className="text-2xl font-bold text-foreground">How We Work</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center px-8 relative">
             <div className="flex flex-col items-center">
               <div className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-full flex items-center justify-center mb-6">
                 <CookingPot className="w-10 h-10 text-foreground" />
               </div>
               <h4 className="font-bold text-foreground text-lg mb-2">Gathering</h4>
               <p className="text-sm text-muted-foreground">Making Fresh and Tastiest Food all over the world.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-full flex items-center justify-center mb-6">
                 <Truck className="w-10 h-10 text-foreground" />
               </div>
               <h4 className="font-bold text-foreground text-lg mb-2">Transportation</h4>
               <p className="text-sm text-muted-foreground">Select the best and transport it to our bases.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-full flex items-center justify-center mb-6">
                 <PackageCheck className="w-10 h-10 text-foreground" />
               </div>
               <h4 className="font-bold text-foreground text-lg mb-2">Packaging</h4>
               <p className="text-sm text-muted-foreground">Carefully pack your order in ecological packaging.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-full flex items-center justify-center mb-6">
                 <div className="relative">
                   <img src="/images/hero_cake.png" className="w-10 h-10 object-contain drop-shadow-md" />
                 </div>
               </div>
               <h4 className="font-bold text-foreground text-lg mb-2">Delivery</h4>
               <p className="text-sm text-muted-foreground">We can drive any products within 2 hours in your hand.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. SPECIAL OFFER (CHEF) */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="flex flex-col md:flex-row bg-[#eab308] rounded-[2rem] overflow-hidden shadow-lg mt-12">
            <div className="md:w-1/3 relative bg-white hidden md:block">
               <img src="/images/bakery_chef.png" alt="Chef" className="absolute bottom-0 right-0 h-[110%] object-contain" />
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center text-white">
              <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4">Limited Time</span>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                Get 20% Off Your<br/>First Custom Cake!
              </h2>
              <p className="text-white/80 mb-8 max-w-md">
                Order any of our signature cakes today and enjoy a massive discount. Perfectly baked, beautifully decorated.
              </p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full self-start transition-colors">
                Claim Offer
              </button>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img src="/images/hero_cake.png" alt="Special Offer" className="w-full h-full object-contain scale-125 origin-bottom-right" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-card py-16">
        <div className="max-w-7xl mx-auto w-full px-6">
           <div className="text-center mb-10">
            <span className="text-[#eab308] font-bold tracking-wider text-sm uppercase">Feedbacks</span>
            <h2 className="text-3xl font-extrabold text-foreground mt-2">What Our Customers Says</h2>
          </div>

          <div className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-lg">
            <div className="md:w-1/2 bg-red-600 p-12 flex items-center justify-center">
               <div className="bg-white rounded-3xl p-8 relative max-w-sm w-full">
                 <div className="absolute -top-6 left-8 text-6xl text-red-600 font-serif leading-none">"</div>
                 <h4 className="font-bold text-red-600 text-lg mb-4 mt-2">Fantastic Experience!</h4>
                 <p className="text-sm text-foreground/80 mb-6 italic leading-relaxed">
                   "This site has transformed the way I enjoy my meals. The convenience and quality are outstanding. Highly impressed!"
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                       <img src="https://ui-avatars.com/api/?name=Rohit+Sharma" alt="User" />
                     </div>
                     <span className="font-bold text-sm">Rohit Sharma</span>
                   </div>
                   <div className="flex text-[#eab308]">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                   </div>
                 </div>
               </div>
            </div>
            <div className="md:w-1/2">
              <img src="/images/bakery_customers.png" alt="Happy Customers" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#fcfaf7] border-t border-border pt-12">
        <div className="max-w-7xl mx-auto w-full px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-[#fdf0d5] rounded-2xl p-8 mb-12 border border-[#f5e1b8]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm"><PackageCheck className="w-6 h-6"/></div>
              <div><h4 className="font-bold text-foreground">Free Shipping</h4><p className="text-xs text-muted-foreground">Free Shipping On All IND</p></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm"><HeadphonesIcon className="w-6 h-6"/></div>
              <div><h4 className="font-bold text-foreground">Money Returns</h4><p className="text-xs text-muted-foreground">Return it Within 30 Days</p></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm"><Star className="w-6 h-6"/></div>
              <div><h4 className="font-bold text-foreground">Secure Payments</h4><p className="text-xs text-muted-foreground">We Ensure Secure Payment</p></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#eab308] shadow-sm"><HeadphonesIcon className="w-6 h-6"/></div>
              <div><h4 className="font-bold text-foreground">Support 24/7</h4><p className="text-xs text-muted-foreground">Contact Us 24 Hours A Day</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-border">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/images/blubug_logo.png" alt="Blubug Logo" className="h-12 w-auto object-contain mix-blend-multiply" />
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  Blubug Bakery
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
                Your favorite freshly baked goods delivered to your door! From artisanal breads to custom cakes, we have it all. Order easily and enjoy hassle-free!
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Blubug Food Court</p>
                <p>Blubug Bakery LLC</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary-500">About Us</a></li>
                <li><a href="#" className="hover:text-primary-500">Store</a></li>
                <li><a href="#" className="hover:text-primary-500">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary-500">Delivery</a></li>
                <li><a href="#" className="hover:text-primary-500">Payments</a></li>
                <li><a href="#" className="hover:text-primary-500">Contact</a></li>
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
            <p>© 2026 Blubug Bakery. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-500">Terms & Conditions</a>
              <a href="#" className="hover:text-primary-500">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Inline helper component
function ShoppingCartIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
