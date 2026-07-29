import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function TopCategoriesSectionSkeleton() {
    return (
        <section className="bg-card py-10">
            <div className="max-w-7xl mx-auto w-full px-6">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-9 h-9 rounded-lg" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="flex space-x-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 bg-background border border-border rounded-[2rem] p-8 shadow-sm relative overflow-hidden min-h-[300px]">
                    <div className="flex flex-col items-center md:items-start flex-1 z-10 w-full">
                        <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4" />
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-16 w-full max-w-sm" />
                    </div>
                    
                    <div className="flex-1 w-full max-w-[320px] mx-auto md:mx-0 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between border border-border">
                            <div className="z-10 w-2/3">
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-8 w-3/4 mb-2" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 h-[70%] w-[70%]">
                                <Skeleton className="w-full h-full rounded-full" />
                            </div>
                            <Skeleton className="z-10 h-9 w-32 rounded-full mt-auto self-start" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center mb-8 flex flex-col items-center">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-9 w-72" />
                </div>

                <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="min-w-[280px] w-[280px] h-[360px]">
                            <Skeleton className="w-full h-full rounded-[2rem]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
