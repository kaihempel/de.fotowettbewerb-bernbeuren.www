import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import { router } from '@inertiajs/react';
import type { GalleryPhoto } from '@/types';
import { GalleryPhotoCard } from '@/components/gallery-photo-card';
import { SkeletonLoader } from '@/components/skeleton-loader';

interface PhotoGridProps {
  initialPhotos: GalleryPhoto[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export const PhotoGrid: FC<PhotoGridProps> = ({
  initialPhotos,
  initialCursor,
  initialHasMore,
}) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(() => {
    // Prevent duplicate requests
    if (isLoading || !hasMore || !cursor) {
      return;
    }

    setIsLoading(true);

    router.get(
      '/gallery/list',
      { cursor },
      {
        preserveScroll: true,
        preserveState: true,
        only: ['photos', 'next_cursor', 'has_more'],
        onSuccess: (page) => {
          const newPhotos = (page.props.photos as GalleryPhoto[]) || [];
          const newCursor = (page.props.next_cursor as string | null) || null;
          const newHasMore = (page.props.has_more as boolean) || false;

          setPhotos((prev) => [...prev, ...newPhotos]);
          setCursor(newCursor);
          setHasMore(newHasMore);
        },
        onError: (errors) => {
          console.error('Failed to load more photos:', errors);
        },
        onFinish: () => {
          setIsLoading(false);
        },
      }
    );
  }, [isLoading, hasMore, cursor]);

  useEffect(() => {
    // Set up Intersection Observer
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px', // Trigger 100px before reaching the sentinel
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        loadMore();
      }
    }, options);

    const currentRef = loadMoreRef.current;
    if (currentRef && observerRef.current) {
      observerRef.current.observe(currentRef);
    }

    // Cleanup
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore, loadMore]);

  return (
    <div className="w-full">
      {/* Empty State */}
      {photos.length === 0 && !isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No photos available yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No photos available yet. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Photo Grid */}
          <div
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            role="list"
            aria-label="Photo gallery"
          >
            {photos.map((photo) => (
              <GalleryPhotoCard
                key={photo.id}
                photo={photo}
                votingUrl={`/gallery/${photo.id}`}
              />
            ))}

            {/* Loading Skeletons */}
            {isLoading && <SkeletonLoader count={20} />}
          </div>

          {/* Intersection Observer Sentinel */}
          <div
            ref={loadMoreRef}
            className="mt-8 flex justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {isLoading && (
              <p className="text-sm text-muted-foreground" aria-label="Loading more photos">
                Loading more photos...
              </p>
            )}
            {!hasMore && photos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                You've reached the end!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
