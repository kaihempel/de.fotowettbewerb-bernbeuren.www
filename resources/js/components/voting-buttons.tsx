import { OxButton, OxSpinner } from "@noxickon/onyx";
import { cn } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";

interface VotingButtonsProps {
  currentVote: "up" | "down" | null;
  onVote: (voteType: "up" | "down") => void;
  isSubmitting: boolean;
}

export default function VotingButtons({
  currentVote,
  onVote,
  isSubmitting,
}: VotingButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">

      {/* Thumbs Up Button */}
      <OxButton
        variant={currentVote === "up" ? "primary" : "secondary"}
        onClick={() => onVote("up")}
        disabled={isSubmitting}
        className={cn(
          "min-h-[44px] min-w-[44px] gap-3 px-6 py-3 text-base transition-all md:min-h-[48px] md:min-w-[48px] md:px-8 md:py-4 md:text-lg",
          currentVote === "up" &&
            "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
          currentVote !== "up" &&
            "border-2 hover:border-green-600 hover:bg-green-50 dark:hover:border-green-700 dark:hover:bg-green-950/30",
        )}
        aria-label="Vote thumbs up"
        aria-pressed={currentVote === "up"}
      >
        {isSubmitting && currentVote === "up" ? (
          <OxSpinner className="size-5 md:size-6" />
        ) : (
          <ThumbsUp
            className={cn(
              "size-5 md:size-6",
              currentVote === "up" && "fill-current",
            )}
          />
        )}
        <span className="font-semibold">Thumbs Up</span>
      </OxButton>
    </div>
  );
}
