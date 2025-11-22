import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import PhotoNavigation from "@/components/photo-navigation";
import PhotoViewer from "@/components/photo-viewer";
import VotingButtons from "@/components/voting-buttons";
import { OxAlert } from "@noxickon/onyx";
import { mdiCheck, mdiRocket } from "@mdi/js";
import GlobalLayout from "@/layouts/global-layout";

interface Photo {
  id: number;
  full_image_url: string;
  title?: string;
  rate: number;
  user_vote: "up" | "down" | null;
  created_at: string;
}

interface GalleryProps {
  photo: Photo;
  nextPhoto: { id: number } | null;
  previousPhoto: { id: number } | null;
  progress: {
    rated: number;
    total: number;
  };
  fwbId: string;
}

function GalleryContent({
  photo,
  nextPhoto,
  previousPhoto,
  progress,
}: GalleryProps) {
  // Track optimistic updates separately from server state
  const [optimisticVote, setOptimisticVote] = useState<"up" | "down" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Current vote is either the optimistic update or the server state
  const currentVote =
    optimisticVote !== null ? optimisticVote : photo.user_vote;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && previousPhoto) {
        router.visit(`/gallery/${previousPhoto.id}`, {
          preserveScroll: false,
        });
      } else if (event.key === "ArrowRight" && nextPhoto) {
        router.visit(`/gallery/${nextPhoto.id}`, {
          preserveScroll: false,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPhoto, previousPhoto]);

  const handleVote = (voteType: "up" | "down") => {
    // If clicking the same vote, do nothing
    if (currentVote === voteType) {
      return;
    }

    const previousVote = currentVote;
    setOptimisticVote(voteType);
    setIsSubmitting(true);
    setErrorMessage(null);

    const submitVote = (attempt: number = 0) => {
      router.post(
        `/gallery/${photo.id}/vote`,
        { vote_type: voteType },
        {
          preserveScroll: true,
          onError: (errors) => {
            // Retry logic: automatic retry up to 3 times with exponential backoff
            if (attempt < 3) {
              const delay = Math.pow(2, attempt) * 500; // 500ms, 1s, 2s
              setTimeout(() => {
                submitVote(attempt + 1);
              }, delay);
              setRetryCount(attempt + 1);
            } else {
              // All retries failed, rollback UI
              setOptimisticVote(previousVote);
              setErrorMessage(
                errors.vote_type ||
                  "Failed to submit vote after multiple attempts. Please try again.",
              );
              setRetryCount(0);
            }
          },
          onSuccess: () => {
            // Vote successful, keep optimistic state
            setRetryCount(0);
            setErrorMessage(null);
          },
          onFinish: () => {
            setIsSubmitting(false);
          },
        },
      );
    };

    submitVote();
  };

  const isCompleted = progress.rated === progress.total;

  return (
    <GlobalLayout className="p-0">
      <Head title="Photo Voting Gallery" />

      <div className="flex min-h-screen flex-col bg-background">
        {/* Progress Indicator */}
        <div className="fixed right-4 top-4 z-10 rounded-lg bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-background/90">
          <p className="text-sm font-medium text-muted-foreground">
            {progress.rated} of {progress.total} photos rated
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="fixed left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2">
            <OxAlert type="default">
              <OxAlert.Icon
                path={mdiRocket}
                iconClass="text-orange-400"
                iconDivClass="bg-orange-500/20"
              />
              <span>{errorMessage}</span>
            </OxAlert>
          </div>
        )}

        {/* Retry Indicator */}
        {retryCount > 0 && (
          <div className="fixed left-1/2 top-4 z-10 -translate-x-1/2">
            <div className="rounded-lg bg-yellow-100 px-4 py-2 text-sm text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100">
              Retrying... (Attempt {retryCount}/3)
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && !errorMessage && (
          <div className="fixed left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2">
            <OxAlert type="default">
              <OxAlert.Icon
                path={mdiCheck}
                iconClass="text-orange-400"
                iconDivClass="bg-orange-500/20"
              />
              <span>
                You have rated all {progress.total} photos. You can still
                navigate and change your votes.
              </span>
            </OxAlert>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center p-4 pb-32 pt-20 md:p-6 md:pb-40">
          <PhotoViewer
            imageUrl={photo.full_image_url}
            title={photo.title}
            rate={photo.rate}
          />
        </div>

        {/* Voting Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 p-4 backdrop-blur-sm dark:bg-background/90 md:p-6">
          <div className="mx-auto max-w-2xl">
            <VotingButtons
              currentVote={currentVote}
              onVote={handleVote}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <PhotoNavigation previousPhoto={previousPhoto} nextPhoto={nextPhoto} />
      </div>
    </GlobalLayout>
  );
}

export default function Gallery(props: GalleryProps) {
  // Use photo ID as key to reset component state when photo changes
  return <GalleryContent key={props.photo.id} {...props} />;
}
