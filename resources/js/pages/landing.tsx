import type { FC } from "react";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import type { GalleryPhoto } from "@/types/index.d";
import { LandingPhotoGrid } from "@/components/landing-photo-grid";
import { OxHeading } from "@noxickon/onyx";
import GlobalLayout from "@/layouts/global-layout";

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
  const { t } = useTranslation("content");

  return (
    <GlobalLayout>
      <Head title={t("landing.title")}>
        <meta
          name="description"
          content={t("landing.meta.description")}
        />
      </Head>

      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <OxHeading as="h1" level={1}>
            {t("landing.title")}
          </OxHeading>
          <p className="text-sm text-gray-1100 mb-4">
            {t("landing.subtitle")}
          </p>
        </div>

        {/* Photo Grid */}
        <LandingPhotoGrid photos={photos} />
      </div>
    </GlobalLayout>
  );
};

export default Landing;
