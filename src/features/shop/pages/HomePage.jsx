import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchProducts, fetchStorefront } from '../redux/shopThunk';
import api from '../../../lib/axios';

// Import Section Components
import { HeroSection } from '../components/home/HeroSection';
import { NewProductsSection } from '../components/home/NewProductsSection';
import { SpecialOfferSection } from '../components/home/SpecialOfferSection';
import { TopCategoriesSection } from '../components/home/TopCategoriesSection';
import { AboutUsSection } from '../components/home/AboutUsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

// Import Skeleton Components
import { HeroSectionSkeleton } from '../components/home/HeroSectionSkeleton';
import { NewProductsSectionSkeleton } from '../components/home/NewProductsSectionSkeleton';
import { SpecialOfferSectionSkeleton } from '../components/home/SpecialOfferSectionSkeleton';
import { TopCategoriesSectionSkeleton } from '../components/home/TopCategoriesSectionSkeleton';
import { AboutUsSectionSkeleton } from '../components/home/AboutUsSectionSkeleton';
import { TestimonialsSectionSkeleton } from '../components/home/TestimonialsSectionSkeleton';

export default function HomePage() {
    const dispatch = useDispatch();
    const { products, categories, storefront } = useSelector((state) => state.shop);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts());
        dispatch(fetchStorefront());
    }, [dispatch]);

    const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    
    const [topCategoriesWithProducts, setTopCategoriesWithProducts] = useState([]);
    const [topCategoriesLoading, setTopCategoriesLoading] = useState(true);
    const [topRatedProducts, setTopRatedProducts] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            setTestimonialsLoading(true);
            try {
                const res = await api.get('/api/v1/engagement/testimonials/featured');
                const data = res.data?.content || (Array.isArray(res.data) ? res.data : []);
                setFeaturedTestimonials(data);
            } catch (err) {
                console.error('Failed to load featured testimonials', err);
            } finally {
                setTestimonialsLoading(false);
            }
        };
        fetchTestimonials();

        const fetchTopCats = async () => {
            setTopCategoriesLoading(true);
            try {
                const res = await api.get('/api/categories/top-with-products');
                setTopCategoriesWithProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to load top categories', err);
            } finally {
                setTopCategoriesLoading(false);
            }
        };
        fetchTopCats();

        const fetchTopRated = async () => {
            try {
                const res = await api.get('/api/products/active?sortBy=averageRating&sortDir=DESC&size=5');
                const data = res.data?.content || res.data?._embedded?.productResponseList || res.data?.data || (Array.isArray(res.data) ? res.data : []);
                setTopRatedProducts(data);
            } catch (err) {
                console.error('Failed to load top rated products', err);
            }
        };
        fetchTopRated();
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
    const productList = Array.isArray(products.data) ? products.data : [];
    const config = storefront.data || {};

    const heroBanners = config?.heroSection?.heroBanners || [];
    const about = config?.aboutSection || null;
    const offers = config?.specialOfferSection?.offers || [];

    const isStorefrontLoading = storefront.loading || (storefront.data === null && !storefront.error);
    const isProductsLoading = products.loading || (products.data.length === 0 && !products.error && !products.pagination);
    const isTopCategoriesLoading = topCategoriesLoading || topCategoriesWithProducts.length === 0;

    return (
        <div className="flex flex-col bg-transparent min-h-screen">
            {isStorefrontLoading ? <HeroSectionSkeleton /> : <HeroSection heroBanners={heroBanners} topRatedProducts={topRatedProducts} />}
            
            {isProductsLoading ? <NewProductsSectionSkeleton /> : <NewProductsSection productList={productList} />}
            
            {isStorefrontLoading ? <SpecialOfferSectionSkeleton /> : <SpecialOfferSection offers={offers} />}
            
            {(isTopCategoriesLoading || isProductsLoading) ? (
                <TopCategoriesSectionSkeleton />
            ) : (
                <TopCategoriesSection 
                    topCategoriesWithProducts={topCategoriesWithProducts} 
                    productList={productList} 
                    topRatedProducts={topRatedProducts} 
                />
            )}
            
            {isStorefrontLoading ? <AboutUsSectionSkeleton /> : <AboutUsSection about={about} />}
            
            {testimonialsLoading ? (
                <TestimonialsSectionSkeleton />
            ) : (
                <TestimonialsSection 
                    activeTestimonial={activeTestimonial} 
                    currentTestimonialIndex={currentTestimonialIndex} 
                    featuredTestimonials={featuredTestimonials} 
                />
            )}
        </div>
    );
}
