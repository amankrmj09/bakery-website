import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../redux/shopThunk';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { LuSearch as Search, LuFilter as Filter, LuShoppingCart as ShoppingCart, LuStar as Star, LuLoader as Loader2, LuCheck as Check, LuUtensilsCrossed as UtensilsCrossed, LuArrowUpDown as ArrowUpDown } from 'react-icons/lu';
import SleekDropdown from '../../../components/ui/SleekDropdown';
import { toast } from 'sonner';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';
import SearchAutocomplete from '../../../components/ui/SearchAutocomplete';

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
      <div className="relative pt-12 pb-20 px-8 flex-shrink-0 flex flex-col items-center">
        {/* Background layer with overflow-hidden to clip images */}
        <div className="absolute inset-0 bg-[#eab308] rounded-b-[3rem] overflow-hidden z-0 shadow-sm">
          <img src="/images/hero_croissant.png" className="absolute -left-10 bottom-0 h-48 opacity-20 rotate-12" alt="" />
          <img src="/images/hero_cupcakes.png" className="absolute -right-10 top-0 h-48 opacity-20 -rotate-12" alt="" />
        </div>
        
        {/* Content layer (not clipped) */}
        <div className="max-w-7xl mx-auto w-full relative z-30 flex flex-col items-center text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 bg-white/20 px-4 py-1 rounded-full">Our Menu</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Delicious Treats,<br/>Baked Fresh Daily
          </h1>
          <div className="max-w-md w-full">
            <SearchAutocomplete 
              placeholder="Search our menu..." 
              initialValue={searchQuery || ''}
              onSearchSubmit={(value) => {
                if (value) {
                  setSearchParams({ search: value });
                } else {
                  setSearchParams({});
                }
              }}
            />
          </div>
        </div>
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

            <SleekDropdown
              icon={ArrowUpDown}
              iconColor="text-primary-500"
              headerTitle="Sort By"
              options={[
                { value: 'name_asc',    label: 'Name (A–Z)' },
                { value: 'name_desc',   label: 'Name (Z–A)' },
                { value: 'price_asc',   label: 'Price: Low to High' },
                { value: 'price_desc',  label: 'Price: High to Low' },
              ]}
              value={sortBy}
              onChange={setSortBy}
              widthClass="w-52"
            />
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
                <ProductCard key={product.id} product={product} className="h-full" />
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
