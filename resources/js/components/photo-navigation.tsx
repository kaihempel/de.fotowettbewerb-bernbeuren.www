import { router } from '@inertiajs/react';
import { OxButton } from '@noxickon/onyx';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoNavigationProps {
  previousPhoto: { id: number } | null;
  nextPhoto: { id: number } | null;
}

export default function PhotoNavigation({
  previousPhoto,
  nextPhoto,
}: PhotoNavigationProps) {
  const handleNavigate = (photoId: number) => {
    router.visit(`/gallery/${photoId}`, {
      preserveScroll: false,
    });
  };

  return (
    <>
      {/* Previous Button */}
      {previousPhoto && (
        <OxButton
          variant="secondary"
          onClick={() => handleNavigate(previousPhoto.id)}
          className={cn(
            'fixed left-4 top-1/2 z-10 size-12 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background/90 dark:bg-background/90 dark:hover:bg-background md:left-6 md:size-14'
          )}
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-6 md:size-7" />
        </OxButton>
      )}

      {/* Next Button */}
      {nextPhoto && (
        <OxButton
          variant="secondary"
          onClick={() => handleNavigate(nextPhoto.id)}
          className={cn(
            'fixed right-4 top-1/2 z-10 size-12 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background/90 dark:bg-background/90 dark:hover:bg-background md:right-6 md:size-14'
          )}
          aria-label="Next photo"
        >
          <ChevronRight className="size-6 md:size-7" />
        </OxButton>
      )}
    </>
  );
}
