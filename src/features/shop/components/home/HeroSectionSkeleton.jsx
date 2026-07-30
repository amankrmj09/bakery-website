import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function HeroSectionSkeleton() {
    return (
        <section className="w-full relative flex items-center justify-center overflow-hidden bg-muted" style={{ height: 'calc(100dvh - 80px)' }}>
            <div className="absolute inset-0 bg-black/50 z-10" />
            
            {/* Overlay Text Skeleton */}
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-16 lg:px-24 xl:px-32 z-20 max-w-7xl mx-auto w-full">
                <Skeleton className="w-[80%] md:w-[60%] h-16 md:h-24 lg:h-32 mb-6 bg-white/20 rounded-2xl" />
                <Skeleton className="w-[90%] md:w-[50%] h-6 md:h-8 mb-3 bg-white/20 rounded-lg" />
                <Skeleton className="w-[70%] md:w-[40%] h-6 md:h-8 mb-10 bg-white/20 rounded-lg" />
                
                <Skeleton className="w-48 h-14 md:h-16 rounded-full bg-[#eab308]/50" />

                {/* Social Proof Skeleton */}
                <div className="flex items-center space-x-4 mt-10 backdrop-blur-sm bg-black/20 py-2 px-4 rounded-full border border-white/10">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="w-8 h-8 rounded-full border-2 border-stone-800 bg-white/20" />
                        ))}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Skeleton className="w-16 h-3 bg-white/20 rounded" />
                        <Skeleton className="w-32 h-3 bg-white/20 rounded" />
                    </div>
                </div>
            </div>

            {/* Floating Showcase Card Skeleton */}
            <div className="absolute bottom-8 md:bottom-12 right-6 md:right-16 lg:right-24 z-20 hidden md:block w-[260px] lg:w-[300px]">
                <Skeleton className="w-full h-[320px] rounded-[2rem] bg-white/20 shadow-2xl" />
            </div>
        </section>
    );
}
