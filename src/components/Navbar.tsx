"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, Heart, Film } from "lucide-react";
import { useNavigation } from "../hooks/useNavigation";
import { useWatchlist } from "../hooks/useWatchlist";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  onSearch?: (query: string) => void;
  showLogo?: boolean;
  className?: string;
}

export default function Navbar({ onSidebarToggle, isSidebarOpen = false, onSearch, showLogo = true, className = "" }: NavbarProps) {
  const { navigateToHome, navigateToWatchlist } = useNavigation();
  const { getWatchlistCount } = useWatchlist();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const updateWatchlistCount = () => {
      setWatchlistCount(getWatchlistCount());
    };

    updateWatchlistCount();
    window.addEventListener("watchlistUpdated", updateWatchlistCount);
    return () => window.removeEventListener("watchlistUpdated", updateWatchlistCount);
  }, [getWatchlistCount]);

  const handleLogoClick = () => {
    navigateToHome();
  };

  const handleWatchlistClick = () => {
    navigateToWatchlist();
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <nav className={`bg-black/20 backdrop-blur-md border-b border-white/10 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="lg:hidden text-white hover:text-gray-300 p-1 transition-colors"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            {/* Logo */}
            {showLogo && (
              <button onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Movie<span className="text-purple-400">Hub</span>
                </h1>
              </button>
            )}
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center px-2 sm:px-4 max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="Search movies..." className="w-full max-w-md lg:max-w-lg" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home Button - Desktop only */}
            <button
              onClick={handleLogoClick}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-white hover:text-purple-400 transition-colors"
              aria-label="Go to home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden lg:inline">Home</span>
            </button>

            {/* Watchlist Button */}
            <button
              onClick={handleWatchlistClick}
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
        </div>
      </div>
    </nav>
  );
}
