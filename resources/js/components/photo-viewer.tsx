import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface PhotoViewerProps {
  imageUrl: string;
  title?: string;
  rate: number;
}

export default function PhotoViewer({ imageUrl, title, rate }: PhotoViewerProps) {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-4">
      {/* Photo Container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-muted shadow-xl">
        <img
          src={imageUrl}
          alt={title || 'Contest photo'}
          className="h-auto w-full max-h-[calc(100vh-20rem)] object-contain md:max-h-[calc(100vh-24rem)]"
          loading="eager"
        />
      </div>

      {/* Photo Info */}
      <div className="flex w-full flex-col items-center gap-2 text-center">
        {title && (
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {title}
          </h2>
        )}

        {/* Rating Display */}
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
          <Star
            className={cn(
              'size-5',
              rate > 0
                ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500'
                : 'text-muted-foreground'
            )}
          />
          <span className="text-sm font-medium text-foreground">
            Rating: {rate}
          </span>
        </div>
      </div>
    </div>
  );
}
