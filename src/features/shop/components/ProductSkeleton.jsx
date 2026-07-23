import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function ProductSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[2rem] shadow-sm flex flex-col p-4">
      <Skeleton className="aspect-square rounded-2xl mb-4" />
      <div className="flex flex-col flex-1">
        <Skeleton className="h-3 w-1/4 mb-2 rounded" />
        <Skeleton className="h-5 w-3/4 mb-3 rounded" />
        <Skeleton className="h-4 w-full mb-1 mt-2 rounded" />
        <Skeleton className="h-4 w-4/5 mb-4 rounded" />
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <Skeleton className="h-7 w-16 rounded" />
          <div className="flex space-x-2">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-24 h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
