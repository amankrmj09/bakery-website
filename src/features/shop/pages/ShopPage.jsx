import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../redux/shopThunk';
import { addItemToCart } from '../../cart/redux/cartThunk';
import { LuSearch as Search, LuFilter as Filter, LuShoppingCart as ShoppingCart, LuStar as Star, LuLoader as Loader2, LuCheck as Check, LuUtensilsCrossed as UtensilsCrossed, LuArrowUpDown as ArrowUpDown, LuChevronLeft as ChevronLeft, LuChevronRight as ChevronRight } from 'react-icons/lu';
import SleekDropdown from '../../../components/ui/SleekDropdown';
import { toast } from 'sonner';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductCard from '../components/ProductCard';
import SearchAutocomplete from '../../../components/ui/SearchAutocomplete';
import { motion, AnimatePresence } from 'framer-motion';

const CACHE_TTL = 300000; // 5 minutes TTL

const getCachedData = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    const now = Date.now();
    if (now - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // ignore
  }
};

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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Cache fresh categories when fetched
  useEffect(() => {
    if (categories.data && categories.data.length > 0) {
      setCachedData('bakery_menu_categories', categories.data);
    }
  }, [categories.data]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory, sortBy, pageSize]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: sortBy
      };
      if (searchQuery) params.query = searchQuery;
      if (selectedCategory) params.categoryId = selectedCategory;
      dispatch(fetchProducts(params)).finally(() => {
        setIsTransitioning(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, selectedCategory, currentPage, pageSize, sortBy]);


  const getCategoryImage = () => {
    if (!selectedCategory) return null;
    const cat = categories.data?.find(c => c.id === selectedCategory);
    if (!cat) return '/images/hero_cake.png';
    
    // Check if the category has an image from the API
    if (cat.mediaUrls && cat.mediaUrls.length > 0) {
      return cat.mediaUrls[0];
    }
    
    // Fallback to generic images based on name
    const name = cat.name.toLowerCase();
    if (name.includes('croissant') || name.includes('pastry') || name.includes('bread')) {
      return '/images/hero_croissant.png';
    } else if (name.includes('cupcake') || name.includes('muffin')) {
      return '/images/hero_cupcakes.png';
    } else {
      return '/images/hero_cake.png';
    }
  };
  const heroImage = getCategoryImage();

  return (
    <div className="flex flex-col relative w-full bg-transparent">
      {/* Menu Header / Half-page BG - FIXED behind content */}
      <div className="fixed top-20 left-0 right-0 h-[45vh] min-h-[300px] flex-shrink-0 flex flex-col items-center justify-center overflow-hidden shadow-sm z-0 rounded-b-[3rem]">
        {/* Background layer */}
        <AnimatePresence mode="wait">
          {selectedCategory === null ? (
            <motion.div 
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-600 z-0"
            >
              <div className="absolute inset-0 bg-white/10 z-10"></div>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/30 rounded-full blur-3xl z-0 transform -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-400/30 rounded-full blur-3xl z-0 transform translate-y-1/2"></div>
              <img src="/images/hero_croissant.png" className="absolute -left-12 bottom-0 h-64 opacity-25 rotate-[15deg] drop-shadow-2xl z-0 transition-transform duration-700 hover:scale-110 hover:-rotate-[5deg]" alt="" />
              <img src="/images/hero_cupcakes.png" className="absolute -right-12 top-0 h-64 opacity-25 -rotate-[15deg] drop-shadow-2xl z-0 transition-transform duration-700 hover:scale-110 hover:rotate-[5deg]" alt="" />
            </motion.div>
          ) : (
            <motion.div 
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row mx-auto w-full max-w-7xl px-4 sm:px-6 relative z-10 gap-8 flex-1 bg-transparent pt-6 pb-20 min-h-[calc(100vh-10rem)]">
        
        {/* LEFT DIV - Sidebar Categories */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-card rounded-[2rem] p-6 shadow-xl border border-border flex flex-col sticky top-[6rem] h-fit max-h-[calc(100vh-8rem)]">
            <h3 className="font-extrabold text-lg text-foreground mb-6 flex items-center flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-primary-500 mr-2" /> Categories
            </h3>
            <ul className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
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
        </div>

        {/* RIGHT DIV */}
        <div className="flex-1 flex flex-col min-w-0 gap-6">
          
          {/* TOP ROW - Controls */}
          <div className="flex flex-col gap-4 flex-shrink-0 bg-transparent">
            {/* Search Bar */}
            <div className="w-full relative z-30">
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

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Pagination Controls */}
              {products.pagination && (products.pagination.totalPages > 1 || products.pagination.totalElements > 0) ? (
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-card shadow-sm px-4 py-2.5 rounded-xl border border-border w-full xl:w-auto">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                    <span>Page <strong className="text-foreground">{products.pagination.number + 1}</strong> of <strong className="text-foreground">{products.pagination.totalPages || 1}</strong></span>
                    <span>({products.pagination.totalElements} items)</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 sm:border-x border-border sm:px-3">
                      <label htmlFor="pageSize" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Show:</label>
                      <SleekDropdown
                        options={[
                          { value: 6, label: '6' },
                          { value: 12, label: '12' },
                          { value: 24, label: '24' },
                        ]}
                        value={pageSize}
                        onChange={(val) => {
                          setPageSize(Number(val));
                          setCurrentPage(0);
                        }}
                        widthClass="w-20"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                        disabled={products.pagination.number === 0 || products.loading}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {(() => {
                        const total = products.pagination.totalPages || 1;
                        const current = products.pagination.number || 0;
                        let pages = [];
                        if (total <= 5) {
                          pages = Array.from({ length: total }, (_, i) => i);
                        } else {
                          if (current <= 2) pages = [0, 1, 2, 3, total - 1];
                          else if (current >= total - 3) pages = [0, total - 4, total - 3, total - 2, total - 1];
                          else pages = [0, current - 1, current, current + 1, total - 1];
                        }
                        return pages.map((pageIdx, idx) => {
                          if (idx > 0 && pageIdx - pages[idx - 1] > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${pageIdx}`}>
                                <span className="px-1 text-xs text-muted-foreground">...</span>
                                <button
                                  onClick={() => setCurrentPage(pageIdx)}
                                  disabled={products.loading}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors flex-shrink-0 ${
                                    current === pageIdx
                                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                      : 'border border-border bg-background hover:bg-muted text-foreground'
                                  }`}
                                >
                                  {pageIdx + 1}
                                </button>
                              </React.Fragment>
                            );
                          }
                          return (
                            <button
                              key={pageIdx}
                              onClick={() => setCurrentPage(pageIdx)}
                              disabled={products.loading}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors flex-shrink-0 ${
                                current === pageIdx
                                  ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                  : 'border border-border bg-background hover:bg-muted text-foreground'
                              }`}
                            >
                              {pageIdx + 1}
                            </button>
                          );
                        });
                      })()}

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min((products.pagination.totalPages || 1) - 1, prev + 1))}
                        disabled={products.pagination.number >= ((products.pagination.totalPages || 1) - 1) || products.loading || products.pagination.totalPages === 0}
                        className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-foreground"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1"></div>
              )}

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
          </div>

          {/* SECOND ROW - Products */}
          <div className="flex-1 overflow-y-auto pr-2 pb-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              {products.loading || isTransitioning ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <ProductSkeleton className="block" />
                  <ProductSkeleton className="hidden sm:block" />
                  <ProductSkeleton className="hidden xl:block" />
                </motion.div>
              ) : products.data && products.data.length > 0 ? (
                <motion.div 
                  key="products"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {products.data.map((product) => (
                    <ProductCard key={product.id} product={product} isNew={false} className="h-full" />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center h-64 text-center bg-card rounded-[2rem] border border-border"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No products found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
