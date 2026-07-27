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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedCategory, sortBy, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: sortBy
      };
      if (searchQuery) params.query = searchQuery;
      if (selectedCategory) params.categoryId = selectedCategory;
      dispatch(fetchProducts(params));
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, searchQuery, selectedCategory, currentPage, pageSize, sortBy]);

  const sortedProducts = products.data;

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

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 -mt-10 relative z-20 gap-8 flex-1 sticky top-0 h-[calc(100vh-5rem)] pb-6">
        {/* Sidebar - Categories */}
        <div className="w-full md:w-72 flex-shrink-0 bg-card rounded-[2rem] p-6 shadow-xl h-full border border-border flex flex-col">
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

        {/* Main Grid area */}
        <div className="flex-1 flex flex-col pt-10 md:pt-0 h-full min-w-0">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4 flex-shrink-0">
            {/* Pagination Controls moved here */}
            {products.pagination && (products.pagination.totalPages > 1 || products.pagination.totalElements > 0) ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm w-full xl:w-auto overflow-x-auto">
                <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                  <span>Page <strong className="text-foreground">{products.pagination.number + 1}</strong> of <strong className="text-foreground">{products.pagination.totalPages || 1}</strong></span>
                  <span>({products.pagination.totalElements} items)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 sm:border-x border-border sm:px-3">
                    <label htmlFor="pageSize" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Show:</label>
                    <select
                      id="pageSize"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0);
                      }}
                      className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
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

          <div className="flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
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
