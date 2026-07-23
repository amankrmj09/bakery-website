import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../redux/shopThunk';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { LuSearch as Search, LuFilter as Filter, LuShoppingCart as ShoppingCart, LuStar as Star, LuChevronDown as ChevronDown, LuLoader as Loader2, LuCheck as Check, LuUtensilsCrossed as UtensilsCrossed } from 'react-icons/lu';
import { toast } from 'sonner';
import ProductSkeleton from '../components/ProductSkeleton';

export default function ShopPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };
  
  const { products, categories } = useSelector((state) => state.shop);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name_asc');
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (selectedCategory) params.categoryId = selectedCategory;
      dispatch(fetchProducts(params));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, selectedCategory]);

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
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
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedProducts = [...products.data].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'name_asc':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="flex flex-col h-full bg-background pb-12">
      {/* Menu Header */}
      <div className="bg-[#eab308] pt-12 pb-20 px-8 relative overflow-hidden rounded-b-[3rem] shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 bg-white/20 px-4 py-1 rounded-full">Our Menu</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Delicious Treats,<br/>Baked Fresh Daily
          </h1>
          <div className="bg-white rounded-full p-2 flex items-center shadow-lg max-w-md w-full">
            <Search className="w-5 h-5 text-muted-foreground ml-3 mr-2" />
            <input 
              type="text" 
              placeholder="Search our menu..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent border-none focus:outline-none text-foreground text-sm"
            />
          </div>
        </div>
        <img src="/images/hero_croissant.png" className="absolute -left-10 bottom-0 h-48 opacity-20 rotate-12" alt="" />
        <img src="/images/hero_cupcakes.png" className="absolute -right-10 top-0 h-48 opacity-20 -rotate-12" alt="" />
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 -mt-10 relative z-20 gap-8 flex-1">
        {/* Sidebar - Categories */}
        <div className="w-full md:w-72 flex-shrink-0 bg-card rounded-[2rem] p-6 shadow-xl h-fit border border-border">
          <h3 className="font-extrabold text-lg text-foreground mb-6 flex items-center">
            <UtensilsCrossed className="w-5 h-5 text-primary-500 mr-2" /> Categories
          </h3>
          <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                selectedCategory === null 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              All Products
              {selectedCategory === null && <Check className="w-4 h-4" />}
            </button>
          </li>
          {categories.data.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex justify-between items-center ${
                  selectedCategory === cat.id 
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat.name}
                {selectedCategory === cat.id && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

        {/* Main Grid area */}
        <div className="flex-1 flex flex-col pt-10 md:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="font-extrabold text-2xl text-foreground">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : selectedCategory 
                ? categories.data.find(c => c.id === selectedCategory)?.name || 'Products'
                : 'All Products'}
            <span className="text-muted-foreground ml-2 text-sm">({sortedProducts.length})</span>
          </h2>

            <div className="flex items-center space-x-3 bg-card px-4 py-2 rounded-xl border border-border shadow-sm w-fit">
              <span className="text-sm font-bold text-muted-foreground">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none text-foreground font-bold text-sm focus:outline-none cursor-pointer pr-6"
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex-1">
          {products.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="group bg-card border border-border rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-4 relative">
                  <div 
                    className="aspect-square bg-muted/30 rounded-2xl relative overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img 
                      src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                      alt={product.name} 
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                      className="object-cover w-full h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                    />
                    {product.status !== 'ACTIVE' ? (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                        Unavailable
                      </div>
                    ) : product.inventory?.isOutOfStock ? (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                        Out of Stock
                      </div>
                    ) : product.inventory?.isLowStock ? (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide shadow-md">
                        Limited Stock
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="pt-4 flex flex-col flex-1">
                    <div className="flex flex-col mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{product.categoryName || 'Treat'}</span>
                      <h3 
                        className="font-extrabold text-lg text-foreground leading-tight line-clamp-1 cursor-pointer hover:text-primary-500 transition-colors" 
                        title={product.name}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 mt-2">
                      {product.description || 'A delicious treat fresh from our bakery.'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <span className="font-extrabold text-xl text-primary-500">${product.price?.toFixed(2) || '0.00'}</span>
                      <div className="flex space-x-2">
                        <button
                          disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock || addingToCart === product.id}
                          onClick={() => handleAddToCart(product)}
                          className="w-12 h-12 flex items-center justify-center bg-muted/50 text-foreground hover:bg-primary-500 hover:text-white transition-colors rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          title="Add to Cart"
                        >
                          {addingToCart === product.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          )}
                        </button>
                        <button
                          disabled={product.status !== 'ACTIVE' || product.inventory?.isOutOfStock || addingToCart === product.id}
                          onClick={async () => {
                            if (!user) {
                              toast.error("You must login before checking out");
                              navigate('/login');
                              return;
                            }
                            await handleAddToCart(product);
                            navigate('/checkout');
                          }}
                          className="px-6 flex items-center justify-center bg-foreground text-card hover:bg-primary-500 hover:text-white transition-colors rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No products found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
