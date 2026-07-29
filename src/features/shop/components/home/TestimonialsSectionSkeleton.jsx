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
                    <div className="md:w-1/2 bg-red-600/30 p-12 flex items-center justify-center">
                        <div className="bg-white rounded-3xl p-8 relative max-w-sm w-full shadow-xl">
                            <Skeleton className="h-6 w-48 mb-4 mt-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-6" />
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="w-4 h-4 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 min-h-[300px]">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
