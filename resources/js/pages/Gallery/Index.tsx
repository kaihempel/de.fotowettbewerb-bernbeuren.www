import { Head } from '@inertiajs/react';
import type { FC } from 'react';
import type { GalleryPageProps } from '@/types';
import { PhotoGrid } from '@/components/photo-grid';
import GlobalLayout from '@/layouts/global-layout';

export default function Index({
  photos,
  next_cursor,
  has_more,
}: GalleryPageProps): ReturnType<FC> {
  return (
    <GlobalLayout>
      <Head title="Photo Gallery">
        <meta
          name="description"
          content="Browse and vote on photos from our photo contest"
        />
      </Head>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Photo Gallery
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Browse and vote on your favorite photos
          </p>
        </div>

        {/* Main Content */}
        <PhotoGrid
          initialPhotos={photos}
          initialCursor={next_cursor}
          initialHasMore={has_more}
        />
      </div>
    </GlobalLayout>
  );
}
