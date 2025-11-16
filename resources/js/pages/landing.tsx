import type { FC } from "react";
import { Head } from "@inertiajs/react";
import type { GalleryPhoto } from "@/types/index.d";
import { PublicHeader } from "@/components/public-header";
import { LandingPhotoGrid } from "@/components/landing-photo-grid";

interface LandingProps {
  photos: GalleryPhoto[];
}

/**
 * Landing page component with dynamic header and photo gallery
 * - Displays public header with scroll animation
 * - Shows photo gallery grid below header
 * - Responsive design (mobile, tablet, desktop)
 * - Dark mode support
 */
const Landing: FC<LandingProps> = ({ photos }) => {
  return (
    <>
      <Head title="Photo Contest Gallery">
        <meta
          name="description"
          content="Browse and vote on contest photo entries"
        />
      </Head>

      {/* Dynamic Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Photo Contest Gallery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Browse and vote on amazing photo submissions
            </p>
          </div>

          {/* Photo Grid */}
          <LandingPhotoGrid photos={photos} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Photo Contest. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Landing;
