import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function NewProductsSectionSkeleton() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 py-16">
            <div className="text-center mb-10 flex flex-col items-center">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, idx) => (
                    <div 
                        key={idx}
                        className="rounded-[2rem] p-6 relative overflow-hidden shadow-lg aspect-square flex flex-col justify-between border border-border"
                    >
                        <div className="z-10 w-2/3">
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-8 w-3/4 mb-2" />
                        </div>
                        
                        <div className="absolute -bottom-4 -right-4 h-[70%] w-[70%]">
                             <Skeleton className="w-full h-full rounded-full" />
                        </div>

                        <Skeleton className="z-10 h-9 w-32 rounded-full mt-auto self-start" />
                    </div>
                ))}
            </div>
        </section>
    );
}
