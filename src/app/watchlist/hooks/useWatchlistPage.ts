import { useState, useEffect } from "react";
import { useWatchlist } from "../../../hooks/useWatchlist";
import { useNavigation } from "../../../hooks/useNavigation";

export function useWatchlistPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const { navigateToMovie, navigateToCategory, navigateToGenre, navigateToSearch, navigateToHome } = useNavigation();

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleMovieClick = (movieId: number) => {
    navigateToMovie(movieId);
  };

  const handleRemoveFromWatchlist = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(movieId);
  };

  const handleClearWatchlist = () => {
    if (watchlist.length > 0) {
      const confirmed = window.confirm("Are you sure you want to clear your entire watchlist?");
      if (confirmed) {
        clearWatchlist();
      }
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    navigateToCategory(categoryId);
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    navigateToGenre(genreId);
  };

  const handleSearch = (query: string) => {
    navigateToSearch(query);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    // State
    isSidebarOpen,
    selectedCategory,
    selectedGenre,
    isLoading,
    watchlist,

    // Handlers
    handleMovieClick,
    handleRemoveFromWatchlist,
    handleClearWatchlist,
    handleCategorySelect,
    handleGenreSelect,
    handleSearch,
    toggleSidebar,
    closeSidebar,

    // Navigation
    navigateToHome,
  };
}
