import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { OxTooltip } from "@noxickon/onyx";
import type { User } from "@/types";

interface AuditTrailIndicatorProps {
  reviewer: User;
  reviewedAt: string;
  status: "approved" | "declined";
}

export const AuditTrailIndicator: FC<AuditTrailIndicatorProps> = ({
  reviewer,
  reviewedAt,
  status,
}) => {
  const { t, i18n } = useTranslation("dashboard");

  const formatDate = (dateString: string) => {
    const locale = i18n.language === "de" ? "de-DE" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionText =
    status === "approved" ? t("audit.approved") : t("audit.declined");

  return (
    <OxTooltip
      position="top"
      content={
        <div className="space-y-1">
          <div className="font-medium">
            {t("audit.actionBy", { action: actionText, name: reviewer.name })}
          </div>
          <div className="text-xs opacity-80">{formatDate(reviewedAt)}</div>
        </div>
      }
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <History className="size-3" />
        <span className="hidden sm:inline">{t("audit.reviewHistory")}</span>
      </div>
    </OxTooltip>
  );
};
