import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";
import { Users, Heart, Camera } from "lucide-react";

export default function AboutUs() {
  const { t } = useTranslation("content");

  return (
    <GlobalLayout>
      <Head title={t("aboutUs.title")} />

      <div className="mx-auto max-w-4xl flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("aboutUs.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("aboutUs.subtitle")}
          </p>
        </div>

        {/* Content Cards */}
        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <span className="text-xl font-semibold">{t("aboutUs.mission.title")}</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{t("aboutUs.mission.paragraph1")}</p>
            <p>{t("aboutUs.mission.paragraph2")}</p>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-primary" />
                <span className="text-xl font-semibold">{t("aboutUs.values.title")}</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>{t("aboutUs.values.creativity.title")}</strong> - {t("aboutUs.values.creativity.description")}
              </li>
              <li>
                <strong>{t("aboutUs.values.community.title")}</strong> - {t("aboutUs.values.community.description")}
              </li>
              <li>
                <strong>{t("aboutUs.values.fairness.title")}</strong> - {t("aboutUs.values.fairness.description")}
              </li>
              <li>
                <strong>{t("aboutUs.values.quality.title")}</strong> - {t("aboutUs.values.quality.description")}
              </li>
            </ul>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-primary" />
                <span className="text-xl font-semibold">{t("aboutUs.team.title")}</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{t("aboutUs.team.paragraph1")}</p>
            <p>{t("aboutUs.team.paragraph2")}</p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
