"use client";

import { Heart } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";
import { useNavigation } from "../hooks/useNavigation";

export default function WatchlistButton() {
  const { getWatchlistCount } = useWatchlist();
  const { navigateToWatchlist } = useNavigation();
  const watchlistCount = getWatchlistCount();

  return (
    <button
      onClick={navigateToWatchlist}
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
  );
}
