import React from 'react';
import { HeroSectionSkeleton } from './HeroSectionSkeleton';
import { NewProductsSectionSkeleton } from './NewProductsSectionSkeleton';
import { SpecialOfferSectionSkeleton } from './SpecialOfferSectionSkeleton';
import { TopCategoriesSectionSkeleton } from './TopCategoriesSectionSkeleton';
import { AboutUsSectionSkeleton } from './AboutUsSectionSkeleton';
import { TestimonialsSectionSkeleton } from './TestimonialsSectionSkeleton';

export function HomePageSkeleton() {
    return (
        <div className="flex flex-col bg-background min-h-screen">
            <HeroSectionSkeleton />
            <NewProductsSectionSkeleton />
            <SpecialOfferSectionSkeleton />
            <TopCategoriesSectionSkeleton />
            <AboutUsSectionSkeleton />
            <TestimonialsSectionSkeleton />
        </div>
    );
}
