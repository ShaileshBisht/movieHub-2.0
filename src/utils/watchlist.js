// Watchlist utility functions for local storage management

const WATCHLIST_KEY = "moviehub_watchlist";

// Get all movies from watchlist
export const getWatchlist = () => {
  if (typeof window === "undefined") return [];

  try {
    const watchlist = localStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error("Error reading watchlist from localStorage:", error);
    return [];
  }
};

// Add movie to watchlist
export const addToWatchlist = (movie) => {
  if (typeof window === "undefined") return false;

  try {
    const watchlist = getWatchlist();

    // Check if movie already exists
    const exists = watchlist.some((item) => item.id === movie.id);
    if (exists) return false;

    // Add movie with essential info
    const movieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview,
      genres: movie.genres || [],
      addedAt: new Date().toISOString(),
    };

    const updatedWatchlist = [movieData, ...watchlist];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));

    // Dispatch custom event for real-time updates
    window.dispatchEvent(
      new CustomEvent("watchlistUpdated", {
        detail: { action: "add", movie: movieData },
      })
    );

    return true;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return false;
  }
};

// Remove movie from watchlist
export const removeFromWatchlist = (movieId) => {
  if (typeof window === "undefined") return false;

  try {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));

    // Dispatch custom event for real-time updates
    window.dispatchEvent(
      new CustomEvent("watchlistUpdated", {
        detail: { action: "remove", movieId },
      })
    );

    return true;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return false;
  }
};

// Check if movie is in watchlist
export const isInWatchlist = (movieId) => {
  if (typeof window === "undefined") return false;

  const watchlist = getWatchlist();
  return watchlist.some((movie) => movie.id === movieId);
};

// Get watchlist count
export const getWatchlistCount = () => {
  return getWatchlist().length;
};

// Clear entire watchlist
export const clearWatchlist = () => {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(WATCHLIST_KEY);
    window.dispatchEvent(
      new CustomEvent("watchlistUpdated", {
        detail: { action: "clear" },
      })
    );
    return true;
  } catch (error) {
    console.error("Error clearing watchlist:", error);
    return false;
  }
};
