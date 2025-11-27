import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import GlobalLayout from "@/layouts/global-layout";
import { OxCard } from "@noxickon/onyx";

export default function Imprint() {
  const { t } = useTranslation("content");

  return (
    <GlobalLayout>
      <Head title={t("imprint.title")} />

      <div className="mx-auto max-w-4xl flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("imprint.title")}
          </h1>
          <p className="text-muted-foreground">{t("imprint.subtitle")}</p>
        </div>

        {/* Content */}
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>{t("imprint.responsible.title")}</h2>
            <p>
              {t("imprint.responsible.name")}
              <br />
              {t("imprint.responsible.street")}
              <br />
              {t("imprint.responsible.city")}
            </p>

            <h2>{t("imprint.contact.title")}</h2>
            <p>
              {t("imprint.contact.email")}
              <br />
              {t("imprint.contact.phone")}
            </p>

            <h2>{t("imprint.disclaimer.title")}</h2>

            <h3>{t("imprint.disclaimer.contentTitle")}</h3>
            <p>{t("imprint.disclaimer.contentText")}</p>

            <h3>{t("imprint.disclaimer.linksTitle")}</h3>
            <p>{t("imprint.disclaimer.linksText")}</p>
          </OxCard.Body>
        </OxCard>
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>{t("imprint.copyright.title")}</h2>
            <p>{t("imprint.copyright.text")}</p>
          </OxCard.Body>
        </OxCard>
        <OxCard>
          <OxCard.Body className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>{t("imprint.privacy.title")}</h2>

            <h3>{t("imprint.privacy.section1.title")}</h3>
            <p>{t("imprint.privacy.section1.text")}</p>

            <h3>{t("imprint.privacy.section2.title")}</h3>
            <p>{t("imprint.privacy.section2.text")}</p>

            <h3>{t("imprint.privacy.section3.title")}</h3>
            <p>{t("imprint.privacy.section3.text")}</p>

            <h3>{t("imprint.privacy.section4.title")}</h3>
            <h4>{t("imprint.privacy.section4.subsection1.title")}</h4>
            <p>{t("imprint.privacy.section4.subsection1.text")}</p>

            <h4>{t("imprint.privacy.section4.subsection2.title")}</h4>
            <p>{t("imprint.privacy.section4.subsection2.text")}</p>

            <h3>{t("imprint.privacy.section5.title")}</h3>
            <p>{t("imprint.privacy.section5.text")}</p>
          </OxCard.Body>
        </OxCard>
      </div>
    </GlobalLayout>
  );
}
