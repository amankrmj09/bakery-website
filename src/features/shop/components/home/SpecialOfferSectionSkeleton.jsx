import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function SpecialOfferSectionSkeleton() {
    return (
        <section className="bg-background py-8 lg:py-16">
            <div className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-6">
                {[...Array(1)].map((_, idx) => (
                    <div 
                        key={idx} 
                        className="w-full overflow-hidden rounded-2xl shadow-lg border border-border/40 aspect-[4/1] relative"
                    >
                        <Skeleton className="w-full h-full" />
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col items-start justify-center">
                             <Skeleton className="h-10 w-1/3 mb-3" />
                             <Skeleton className="h-6 w-1/2 mb-2" />
                             <Skeleton className="h-6 w-2/5" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
