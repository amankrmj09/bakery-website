import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function TestimonialsSectionSkeleton() {
    return (
        <section className="bg-card py-16">
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="text-center mb-10 flex flex-col items-center">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-10 w-72" />
                </div>

                <div className="flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-lg">
                    <div className="md:w-1/2 bg-stone-900 p-12 flex items-center justify-center relative overflow-hidden">
                        {/* Decorative background circles for skeleton */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-800/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl" />
                        
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 relative max-w-sm w-full shadow-2xl z-10">
                            <Skeleton className="h-6 w-48 mb-4 mt-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-8" />
                            
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="w-4 h-4 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pagination Dots Skeleton */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className={`h-2 rounded-full ${i === 0 ? 'w-6' : 'w-2'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/2 relative min-h-[400px]">
                        <Skeleton className="w-full h-full absolute inset-0 rounded-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 to-transparent md:bg-gradient-to-l md:from-transparent md:to-stone-900/20" />
                    </div>
                </div>
            </div>
        </section>
    );
}
