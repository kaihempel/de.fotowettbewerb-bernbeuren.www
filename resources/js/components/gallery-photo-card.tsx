import { useState, type FC } from "react";
import { Link } from "@inertiajs/react";
import type { GalleryPhoto } from "@/types";

interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
  votingUrl: string;
}

export const GalleryPhotoCard: FC<GalleryPhotoCardProps> = ({
  photo,
  votingUrl,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <Link
      href={votingUrl}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-muted transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-105 hover:shadow-lg"
      role="link"
      aria-label={`View and vote on photo ${photo.id}`}
    >
      {/* Error Fallback */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
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
            <p className="mt-2 text-xs text-muted-foreground">
              Failed to load image
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Image */}
          <img
            src={photo.thumbnail_url}
            alt={`Photo ${photo.id}`}
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10 dark:group-hover:bg-black/30" />

          {/* Rating Badge (if available) */}
          {photo.rate !== null && (
            <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {photo.rate > 0 ? "+" : ""}
              {photo.rate}
            </div>
          )}
        </>
      )}
    </Link>
  );
};
