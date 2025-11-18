import type { FC } from "react";
import { router } from "@inertiajs/react";
import { Filter, Circle, CheckCircle, XCircle, Clock } from "lucide-react";
import { OxButton } from "@noxickon/onyx";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "new" | "approved" | "declined";

interface PhotoStatusFilterProps {
  currentFilter: StatusFilter;
  counts?: {
    all: number;
    new: number;
    approved: number;
    declined: number;
  };
}

interface FilterOption {
  value: StatusFilter;
  label: string;
  icon: typeof Circle;
  description: string;
}

const filterOptions: FilterOption[] = [
  {
    value: "all",
    label: "All",
    icon: Circle,
    description: "Show all submissions",
  },
  {
    value: "new",
    label: "Pending",
    icon: Clock,
    description: "Awaiting review",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle,
    description: "Accepted submissions",
  },
  {
    value: "declined",
    label: "Declined",
    icon: XCircle,
    description: "Rejected submissions",
  },
];

export const PhotoStatusFilter: FC<PhotoStatusFilterProps> = ({
  currentFilter,
  counts,
}) => {
  const handleFilterChange = (filter: StatusFilter) => {
    if (filter === currentFilter) return;

    const params = new URLSearchParams();

    if (filter !== "all") {
      params.set("status", filter);
    }

    // Reset to page 1 when changing filter
    params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : window.location.pathname;

    router.get(url, undefined, {
      preserveState: true,
      preserveScroll: false,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="size-4" />
        <span>Filter by status</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentFilter === option.value;
          const count = counts?.[option.value];

          return (
            <OxButton
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              variant={isActive ? "primary" : "secondary"}
              size="sm"
              className={cn(
                "gap-2 transition-all",
                isActive && "pointer-events-none",
                option.value === "new" &&
                  !isActive &&
                  "hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
                option.value === "approved" &&
                  !isActive &&
                  "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20",
                option.value === "declined" &&
                  !isActive &&
                  "hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  option.value === "new" &&
                    isActive &&
                    "text-yellow-600 dark:text-yellow-400",
                  option.value === "approved" &&
                    isActive &&
                    "text-green-600 dark:text-green-400",
                  option.value === "declined" &&
                    isActive &&
                    "text-red-600 dark:text-red-400",
                )}
              />
              <span>{option.label}</span>
              {typeof count === "number" && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    isActive
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </OxButton>
          );
        })}
      </div>
    </div>
  );
};
