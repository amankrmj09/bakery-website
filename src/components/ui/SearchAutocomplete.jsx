import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSearch as Search, LuLoader as Loader2 } from 'react-icons/lu';
import { shopApi } from '../../features/shop/api/shopApi';

const SearchAutocomplete = ({ 
    placeholder = "Search our menu...", 
    autoFocus = false, 
    onSearchSubmit,
    initialValue = '',
    variant = 'default', // 'default' | 'navbar'
    expandable = false,
    inputId
}) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(autoFocus);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(initialValue || '');
    }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await shopApi.fetchProducts({ query });
                // Spring Data PagedModel puts the array in 'content'
                const products = response.data?.content || response.data?.data || response.data || [];
                setResults(Array.isArray(products) ? products.slice(0, 5) : []); 
                setIsOpen(true);
            } catch (error) {
                console.error("Error fetching search suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setIsOpen(false);
            if (onSearchSubmit) {
                onSearchSubmit(query);
            } else {
                if (query.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(query)}`);
                } else {
                    navigate('/shop');
                }
            }
        }
    };

    const handleResultClick = (productId) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/product/${productId}`);
    };

    const containerClasses = {
        default: "bg-white rounded-full p-2 flex items-center shadow-lg relative z-10 transition-shadow focus-within:ring-2 focus-within:ring-primary-500/50",
        navbar: "bg-muted/30 focus-within:bg-card border border-transparent focus-within:border-border/50 text-foreground px-3 py-1.5 rounded-full transition-all duration-300 relative z-10 flex items-center shadow-sm"
    };

    const widthClasses = expandable 
        ? (isFocused || query ? "w-64 md:w-80" : "w-32 md:w-48 cursor-pointer") 
        : "w-full";

    return (
        <div className={`relative transition-all duration-300 ${widthClasses}`} ref={wrapperRef}>
            <div className={`w-full ${containerClasses[variant]}`}>
                <Search className={`w-5 h-5 flex-shrink-0 ${variant === 'navbar' ? 'text-muted-foreground w-4 h-4 ml-1 mr-2' : 'text-muted-foreground ml-3 mr-2'}`} />
                <input 
                    id={inputId}
                    type="text" 
                    placeholder={placeholder}
                    value={query}
                    onFocus={() => {
                        setIsFocused(true);
                        if (query) setIsOpen(true);
                    }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen && e.target.value) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    autoFocus={autoFocus}
                    className={`flex-1 bg-transparent border-none focus:outline-none text-foreground text-sm min-w-0 ${variant === 'navbar' && !isFocused && !query ? 'cursor-pointer' : ''}`}
                />
                {variant === 'navbar' && !isFocused && !query && (
                    <kbd className="hidden md:inline-flex items-center gap-1 bg-background/50 border border-border/50 rounded px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground ml-2 flex-shrink-0">
                        <span className="text-[9px]">⌘</span>K
                    </kbd>
                )}
                {isLoading && (
                    <Loader2 className="w-4 h-4 text-primary-500 animate-spin mr-3 flex-shrink-0" />
                )}
            </div>

            {/* Dropdown Menu */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {results.length > 0 ? (
                        <ul className="max-h-[60vh] overflow-y-auto py-2">
                            {results.map((product) => (
                                <li key={product.id}>
                                    <button
                                        onClick={() => handleResultClick(product.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            <img 
                                                src={product.primaryImageUrl || product.mediaUrls?.[0] || '/images/placeholder_bakery.png'} 
                                                alt={product.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_bakery.png'; }}
                                                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary-500 transition-colors">{product.name}</h4>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{product.categoryName || 'Treat'}</p>
                                        </div>
                                        <div className="font-extrabold text-primary-500 text-sm flex-shrink-0">
                                            ${product.price?.toFixed(2) || '0.00'}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !isLoading && (
                            <div className="px-4 py-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                                <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                No products found for "{query}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchAutocomplete;
