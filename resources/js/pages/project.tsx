import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";
import { Target, Calendar, Award, Info } from "lucide-react";

export default function Project() {
  const { t } = useTranslation("content");

  return (
    <GlobalLayout>
      <Head title={t("project.title")} />

      <div className="mx-auto max-w-4xl flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("project.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("project.subtitle")}
          </p>
        </div>

        {/* Content Cards */}
        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Info className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  {t("project.whatIs.title")}
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{t("project.whatIs.paragraph1")}</p>
            <p>{t("project.whatIs.paragraph2")}</p>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                <span className="text-xl font-semibold">{t("project.goals.title")}</span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>{t("project.goals.goal1")}</li>
              <li>{t("project.goals.goal2")}</li>
              <li>{t("project.goals.goal3")}</li>
              <li>{t("project.goals.goal4")}</li>
              <li>{t("project.goals.goal5")}</li>
            </ul>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  {t("project.process.title")}
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <ol>
              <li>
                <strong>{t("project.process.step1.title")}</strong> - {t("project.process.step1.description")}
              </li>
              <li>
                <strong>{t("project.process.step2.title")}</strong> - {t("project.process.step2.description")}
              </li>
              <li>
                <strong>{t("project.process.step3.title")}</strong> - {t("project.process.step3.description")}
              </li>
              <li>
                <strong>{t("project.process.step4.title")}</strong> - {t("project.process.step4.description")}
              </li>
              <li>
                <strong>{t("project.process.step5.title")}</strong> - {t("project.process.step5.description")}
              </li>
            </ol>
          </OxCard.Body>
        </OxCard>

        <OxCard>
          <OxCard.Header
            title={
              <div className="flex items-center gap-2">
                <Award className="size-5 text-primary" />
                <span className="text-xl font-semibold">
                  {t("project.categories.title")}
                </span>
              </div>
            }
          />
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <p>{t("project.categories.intro")}</p>
            <ul>
              <li>{t("project.categories.category1")}</li>
              <li>{t("project.categories.category2")}</li>
              <li>{t("project.categories.category3")}</li>
              <li>{t("project.categories.category4")}</li>
            </ul>
            <p>{t("project.categories.outro")}</p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
