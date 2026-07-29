import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function AboutUsSectionSkeleton() {
    return (
        <section className="bg-background py-16">
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="flex items-center space-x-2 mb-8">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="h-8 w-40" />
                </div>

                <div className="bg-card border border-border rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden mb-20">
                    <div className="md:w-1/2 z-10 pr-8 w-full">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-12 w-64 mb-6" />
                        <Skeleton className="h-4 w-full max-w-md mb-2" />
                        <Skeleton className="h-4 w-5/6 max-w-md mb-2" />
                        <Skeleton className="h-4 w-4/5 max-w-md mb-8" />
                        <Skeleton className="h-12 w-36 rounded-xl" />
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0 relative min-h-[400px] md:min-h-[500px] flex items-center justify-center w-full">
                        <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-[30%_35%_25%_40%/35%_25%_40%_30%]" />
                        <Skeleton className="absolute left-2 md:-left-8 bottom-8 w-36 h-36 md:w-48 md:h-48 rounded-[25%_35%_40%_30%/30%_40%_25%_35%]" />
                        <Skeleton className="absolute right-2 md:-right-4 top-8 w-32 h-32 md:w-44 md:h-44 rounded-[35%_25%_30%_40%/40%_30%_35%_25%]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
