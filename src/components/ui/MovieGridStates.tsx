import { Loader2, AlertCircle } from "lucide-react";

interface LoadingStateProps {
  text?: string;
}

export function LoadingState({ text = "Loading movies..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-purple-500" />
      <p className="text-gray-400 text-sm sm:text-base">{text}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export function ErrorState({
  title = "Oops! Something went wrong",
  message = "We couldn't load the movies. Please check your connection and try again.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4">
      <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-md">{message}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  searchQuery?: string;
}

export function EmptyState({ title = "No movies found", message = "No movies available at the moment.", searchQuery }: EmptyStateProps) {
  const displayMessage = searchQuery ? `No results found for "${searchQuery}". Try a different search term.` : message;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-md">{displayMessage}</p>
      </div>
    </div>
  );
}
