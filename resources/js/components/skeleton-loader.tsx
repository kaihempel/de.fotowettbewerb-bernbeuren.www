import type { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({ count = 20 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-square"
          role="status"
          aria-label="Loading photo"
        >
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ))}
    </>
  );
};
