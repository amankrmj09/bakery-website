import React from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

export function HeroSectionSkeleton() {
    return (
        <section className="w-full bg-background relative" style={{ height: 'calc(100dvh - 80px)' }}>
            <div className="w-full h-full flex flex-row gap-4 lg:gap-6 px-4 lg:px-8 py-4 lg:py-6 relative z-10">
                {/* Main Hero Image Skeleton */}
                <div className="flex-1 sm:flex-[3] relative rounded-[2rem] overflow-hidden">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Side column Skeletons */}
                <div className="hidden sm:flex flex-[2] flex-col gap-4 lg:gap-6">
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}
