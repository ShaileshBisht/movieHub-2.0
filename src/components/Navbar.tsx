"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigation } from "../hooks/useNavigation";
import { useWatchlist } from "../hooks/useWatchlist";
import SearchBar from "./SearchBar";
import NavbarLogo from "./ui/NavbarLogo";
import NavbarActions from "./ui/NavbarActions";

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
            {showLogo && <NavbarLogo onClick={handleLogoClick} />}
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 flex justify-center px-2 sm:px-4 max-w-2xl">
            <SearchBar onSearch={handleSearch} placeholder="Search movies..." className="w-full max-w-md lg:max-w-lg" />
          </div>

          {/* Right Section */}
          <NavbarActions onHomeClick={handleLogoClick} onWatchlistClick={handleWatchlistClick} watchlistCount={watchlistCount} />
        </div>
      </div>
    </nav>
  );
}
