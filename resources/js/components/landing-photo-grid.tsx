import type { FC } from "react";
import { Link } from "@inertiajs/react";
import type { GalleryPhoto } from "@/types/index.d";
import { cn } from "@/lib/utils";
import { OxCard, OxHeading } from "@noxickon/onyx";
import { show } from "@/routes/gallery";

interface LandingPhotoGridProps {
  photos: GalleryPhoto[];
  className?: string;
}

/**
 * Responsive photo grid component for the landing page
 * - 1 column on mobile (320px-768px)
 * - 3 columns on tablet (768px-1024px)
 * - 4 columns on desktop (1024px+)
 * - Preserves aspect ratios without cropping
 * - Lazy loads images below the fold
 * - Click to navigate to photo rating page
 */
export const LandingPhotoGrid: FC<LandingPhotoGridProps> = ({
  photos,
  className,
}) => {
  if (photos.length === 0) {
    return (
      <OxCard>
        <OxCard.Body className={cn("text-center", className)}>
          <svg
            className="mb-4 size-16 text-gray-400 dark:text-gray-600"
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
          <OxHeading as="h3" level={3}>
            No photos available yet
          </OxHeading>
          <p className="text-sm text-gray-1100 mb-4">
            Check back soon for contest entries!
          </p>
        </OxCard.Body>
      </OxCard>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      role="list"
      aria-label="Photo gallery"
    >
      {photos.map((photo, index) => (
        <Link
          key={photo.id}
          href={show.url(photo)}
          className="group relative overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
          role="listitem"
        >
          <div className="relative">
            <img
              src={photo.thumbnail_url}
              alt={`Contest photo ${photo.id}`}
              loading={index < 12 ? "eager" : "lazy"}
              className="aspect-auto w-full object-contain"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          {/* Rating badge */}
          {photo.rate !== null && photo.rate > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 dark:text-gray-100">
              <svg
                className="size-4 fill-yellow-400 text-yellow-400"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{photo.rate.toFixed(1)}</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};
