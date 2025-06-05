"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Film, Star, Calendar, TrendingUp, Home as HomeIcon, Zap } from "lucide-react";
import { useGetMovieGenresQuery } from "../../store/api/tmdbApi";

const categories = [
  { id: null, label: "Home", icon: HomeIcon, endpoint: "trending" },
  { id: "trending", label: "Trending", icon: Zap, endpoint: "trending" },
  { id: "popular", label: "Popular", icon: Star, endpoint: "popular" },
  { id: "top_rated", label: "Top Rated", icon: TrendingUp, endpoint: "top_rated" },
  { id: "now_playing", label: "Now Playing", icon: Film, endpoint: "now_playing" },
  { id: "upcoming", label: "Upcoming", icon: Calendar, endpoint: "upcoming" },
];

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export default function Sidebar({ selectedCategory, selectedGenre, onCategorySelect, onGenreSelect }) {
  const router = useRouter();
  const [isGenresExpanded, setIsGenresExpanded] = useState(false);

  useGetMovieGenresQuery();

  const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      // Home button - clear all parameters
      router.push("/");
    } else {
      onCategorySelect(categoryId);
    }
  };

  const handleGenreClick = (genreId) => {
    onGenreSelect(genreId);
  };

  const toggleGenres = () => {
    setIsGenresExpanded(!isGenresExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-black/90 backdrop-blur-sm text-white">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">M</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">MovieHub</h2>
            <p className="text-xs sm:text-sm text-gray-400">Discover Movies</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Categories */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-3 sm:mb-4 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-1 sm:space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;

                return (
                  <li key={category.id || "home"}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base font-medium truncate">{category.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <button
              onClick={toggleGenres}
              className="w-full flex items-center justify-between text-sm sm:text-base font-semibold text-gray-300 mb-3 sm:mb-4 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Genres</span>
              {isGenresExpanded ? <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {isGenresExpanded && (
              <ul className="space-y-1">
                {genres.map((genre) => {
                  const isActive = selectedGenre === genre.id;

                  return (
                    <li key={genre.id}>
                      <button
                        onClick={() => handleGenreClick(genre.id)}
                        className={`w-full text-left px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-pink-600 text-white shadow-lg shadow-pink-500/25"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-sm sm:text-base truncate">{genre.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </nav>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-400">Powered by TMDB</p>
          <p className="text-xs text-gray-500 mt-1">© 2024 MovieHub</p>
        </div>
      </div>
    </div>
  );
}
