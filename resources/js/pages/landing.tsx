import type { FC } from "react";
import { Head } from "@inertiajs/react";
import type { GalleryPhoto } from "@/types/index.d";
import { PublicHeader } from "@/components/public-header";
import { LandingPhotoGrid } from "@/components/landing-photo-grid";
import { OxMainContent } from "@noxickon/onyx/layouts";
import { OxHeading } from "@noxickon/onyx";

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
      <OxMainContent.Body>
        <div className="mx-auto max-w-7xl">

          {/* Page Title */}
          <div className="mb-8 text-center">
            <OxHeading as="h1" level={1}>
              Photo Contest Gallery
            </OxHeading>
            <p className="text-sm text-gray-1100 mb-4">
              Browse and vote on amazing photo submissions
            </p>
          </div>

          {/* Photo Grid */}
          <LandingPhotoGrid photos={photos} />
        </div>
      </OxMainContent.Body>
    </>
  );
};

export default Landing;
