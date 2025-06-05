import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  original_language: string;
  genres: { id: number; name: string }[];
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    const loadWatchlist = () => {
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
        setWatchlist(stored);
      }
    };

    loadWatchlist();
    window.addEventListener("watchlistUpdated", loadWatchlist);
    return () => window.removeEventListener("watchlistUpdated", loadWatchlist);
  }, []);

  const addToWatchlist = (movie: Movie) => {
    if (typeof window !== "undefined") {
      const currentWatchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
      const updatedWatchlist = [...currentWatchlist, movie];
      localStorage.setItem("movieWatchlist", JSON.stringify(updatedWatchlist));
      setWatchlist(updatedWatchlist);
      window.dispatchEvent(new CustomEvent("watchlistUpdated"));
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    if (typeof window !== "undefined") {
      const currentWatchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
      const updatedWatchlist = currentWatchlist.filter((item: Movie) => item.id !== movieId);
      localStorage.setItem("movieWatchlist", JSON.stringify(updatedWatchlist));
      setWatchlist(updatedWatchlist);
      window.dispatchEvent(new CustomEvent("watchlistUpdated"));
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    const isInWatchlist = watchlist.some((item) => item.id === movie.id);
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((item) => item.id === movieId);
  };

  const getWatchlistCount = () => watchlist.length;

  const clearWatchlist = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("movieWatchlist", JSON.stringify([]));
      setWatchlist([]);
      window.dispatchEvent(new CustomEvent("watchlistUpdated"));
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    getWatchlistCount,
    clearWatchlist,
  };
};
