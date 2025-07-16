"use client";

import { useState } from "react";
import Sidebar from "../ui/sidebar";
import Navbar from "../Navbar";
import { useNavigation } from "../../hooks/useNavigation";

interface MovieDetailsLayoutProps {
  children: React.ReactNode;
}

export default function MovieDetailsLayout({ children }: MovieDetailsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory] = useState<string | null>("trending");
  const [selectedGenre] = useState<number | null>(null);

  const { navigateToCategory, navigateToGenre, navigateToSearch } = useNavigation();

  const handleCategorySelect = (categoryId: string | null) => {
    navigateToCategory(categoryId);
  };

  const handleGenreSelect = (genreId: number | null) => {
    navigateToGenre(genreId);
  };

  const handleSearch = (query: string) => {
    navigateToSearch(query);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          selectedGenre={selectedGenre}
          onCategorySelect={handleCategorySelect}
          onGenreSelect={handleGenreSelect}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation */}
        <Navbar onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onSearch={handleSearch} showLogo={false} />

        {/* Movie Details Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
