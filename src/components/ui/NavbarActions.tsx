import { Home, Heart } from "lucide-react";

interface NavbarActionsProps {
  onHomeClick: () => void;
  onWatchlistClick: () => void;
  watchlistCount: number;
}

export default function NavbarActions({ onHomeClick, onWatchlistClick, watchlistCount }: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Home Button - Desktop only */}
      <button
        onClick={onHomeClick}
        className="hidden sm:flex items-center gap-2 px-3 py-2 text-white hover:text-purple-400 transition-colors"
        aria-label="Go to home"
      >
        <Home className="w-5 h-5" />
        <span className="hidden lg:inline">Home</span>
      </button>

      {/* Watchlist Button */}
      <button
        onClick={onWatchlistClick}
        className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm sm:text-base"
      >
        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Watchlist</span>
        {watchlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
            {watchlistCount > 99 ? "99+" : watchlistCount}
          </span>
        )}
      </button>
    </div>
  );
}
