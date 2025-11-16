import { Head } from '@inertiajs/react';
import type { FC } from 'react';
import type { GalleryPageProps } from '@/types';
import { PhotoGrid } from '@/components/photo-grid';

export default function Index({
  photos,
  next_cursor,
  has_more,
}: GalleryPageProps): ReturnType<FC> {
  return (
    <>
      <Head title="Photo Gallery">
        <meta
          name="description"
          content="Browse and vote on photos from our photo contest"
        />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Photo Gallery
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Browse and vote on your favorite photos
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <PhotoGrid
            initialPhotos={photos}
            initialCursor={next_cursor}
            initialHasMore={has_more}
          />
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
            <p>Photo Contest Gallery</p>
          </div>
        </footer>
      </div>
    </>
  );
}
