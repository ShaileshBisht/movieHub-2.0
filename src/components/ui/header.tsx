"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Heart, Film } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({ onSidebarToggle, isSidebarOpen, onSearch, searchQuery }: HeaderProps) {
  const router = useRouter();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const updateWatchlistCount = () => {
      if (typeof window !== "undefined") {
        const watchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
        setWatchlistCount(watchlist.length);
      }
    };

    updateWatchlistCount();
    window.addEventListener("watchlistUpdated", updateWatchlistCount);
    return () => window.removeEventListener("watchlistUpdated", updateWatchlistCount);
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleWatchlistClick = () => {
    router.push("/watchlist");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 text-white hover:text-purple-300 transition-colors rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 text-white hover:text-purple-300 transition-colors group"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MovieHub
                </h1>
                {/* <p className="text-xs text-gray-400 -mt-1">2.0</p> */}
              </div>
            </button>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4 sm:mx-6 lg:mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative transition-all duration-200 ${isSearchFocused ? "scale-105" : ""}`}>
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>
            </form>
          </div>

          {/* Right Section - Watchlist */}
          <div className="flex items-center">
            <button
              onClick={handleWatchlistClick}
              className="relative p-2 sm:p-3 text-white hover:text-purple-300 transition-colors rounded-lg hover:bg-white/10 group"
              aria-label="View watchlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
                  {watchlistCount > 99 ? "99+" : watchlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchFocused && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/10 p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">{searchQuery ? `Searching for "${searchQuery}"` : "Start typing to search movies..."}</p>
          </div>
        </div>
      )}
    </header>
  );
}
