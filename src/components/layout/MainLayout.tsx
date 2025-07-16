"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../ui/sidebar";
import SearchBar from "../SearchBar";
import WatchlistButton from "../WatchlistButton";
import { useNavigation } from "../../hooks/useNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
  category: string | null;
  genre: number | null;
}

export default function MainLayout({ children, category, genre }: MainLayoutProps) {
  const { navigateToCategory, navigateToGenre } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategorySelect = (categoryId: string | null) => {
    navigateToCategory(categoryId);
    setIsSidebarOpen(false);
  };

  const handleGenreSelect = (genreId: number | null) => {
    navigateToGenre(genreId);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 xl:w-72 
          bg-black/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:flex lg:flex-col
        `}
      >
        {/* Mobile Close Button */}
        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 lg:hidden z-10">
          <X className="w-6 h-6" />
        </button>

        <Sidebar
          selectedCategory={category}
          selectedGenre={genre}
          onCategorySelect={handleCategorySelect}
          onGenreSelect={handleGenreSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <MainHeader onSidebarToggle={toggleSidebar} />

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

interface MainHeaderProps {
  onSidebarToggle: () => void;
}

function MainHeader({ onSidebarToggle }: MainHeaderProps) {
  const { navigateToSearch } = useNavigation();

  const handleSearch = (query: string) => {
    navigateToSearch(query);
  };

  return (
    <header className="flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          <button onClick={onSidebarToggle} className="lg:hidden text-white hover:text-gray-300 p-1">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - Hidden on desktop since it's in sidebar */}
          <MobileLogo />

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-2 sm:px-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Watchlist Button */}
          <WatchlistButton />
        </div>
      </div>
    </header>
  );
}

function MobileLogo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg sm:text-xl">M</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-white">
        Movie<span className="text-purple-400">Hub</span>
      </h1>
    </div>
  );
}
