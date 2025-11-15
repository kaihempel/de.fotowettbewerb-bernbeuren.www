import type { FC } from "react";
import { History } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionText = status === "approved" ? "Approved" : "Declined";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <History className="size-3" />
          <span className="hidden sm:inline">Review history</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <div className="font-medium">
            {actionText} by {reviewer.name}
          </div>
          <div className="text-xs opacity-80">{formatDate(reviewedAt)}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
