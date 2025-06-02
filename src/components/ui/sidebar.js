"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Film,
  Star,
  Calendar,
  Zap,
  Menu,
  X,
  Sword,
  Heart,
  Laugh,
  Skull,
  Zap as Lightning,
  Users,
  Music,
  Sparkles,
  Shield,
  Rocket,
  Ghost,
  Crown,
  Mountain,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMovieGenresQuery } from "../../store/api/tmdbApi";

const categories = [
  { id: null, label: "Home", icon: Film, endpoint: "trending" },
  { id: "trending", label: "Trending", icon: Zap, endpoint: "trending" },
  { id: "popular", label: "Popular", icon: Star, endpoint: "popular" },
  { id: "top_rated", label: "Top Rated", icon: Star, endpoint: "top_rated" },
  { id: "now_playing", label: "Now Playing", icon: Film, endpoint: "now_playing" },
  { id: "upcoming", label: "Upcoming", icon: Calendar, endpoint: "upcoming" },
];

// Genre icon mapping
const getGenreIcon = (genreName) => {
  const name = genreName.toLowerCase();

  if (name.includes("action")) return Sword;
  if (name.includes("adventure")) return Mountain;
  if (name.includes("animation")) return Sparkles;
  if (name.includes("comedy")) return Laugh;
  if (name.includes("crime")) return Shield;
  if (name.includes("documentary")) return Camera;
  if (name.includes("drama")) return Heart;
  if (name.includes("family")) return Users;
  if (name.includes("fantasy")) return Crown;
  if (name.includes("history")) return Calendar;
  if (name.includes("horror")) return Ghost;
  if (name.includes("music")) return Music;
  if (name.includes("mystery")) return Skull;
  if (name.includes("romance")) return Heart;
  if (name.includes("science fiction") || name.includes("sci-fi")) return Rocket;
  if (name.includes("thriller")) return Lightning;
  if (name.includes("war")) return Sword;
  if (name.includes("western")) return Star;

  return Film; // Default icon
};

export default function Sidebar({ onCategorySelect, onGenreSelect, selectedCategory, selectedGenre, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    genres: true,
  });

  const { data: genresData, isLoading: genresLoading } = useGetMovieGenresQuery();

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Notify parent component about the toggle
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const toggleSection = (section) => {
    if (isCollapsed) return;
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  const handleGenreClick = (genre) => {
    onGenreSelect(genre);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-gradient-to-b from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-md border-r border-purple-500/20 h-dvh overflow-y-auto transition-all duration-300 ease-in-out shadow-2xl flex flex-col`}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-purple-500/20 flex justify-center bg-black/20 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-purple-600/30 hover:text-purple-200 p-2 rounded-lg transition-all duration-200"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Categories Section */}
        <div className="mb-6">
          {!isCollapsed ? (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-purple-600/20 p-3 h-auto mb-3 rounded-lg border border-purple-500/20"
                onClick={() => toggleSection("categories")}
              >
                <span className="font-semibold text-sm text-purple-200">Categories</span>
                {expandedSections.categories ? (
                  <ChevronDown className="h-4 w-4 text-purple-300" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-purple-300" />
                )}
              </Button>

              {expandedSections.categories && (
                <div className="space-y-2 ml-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;

                    return (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className={`w-full justify-start text-left p-3 h-auto text-sm rounded-lg transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-600/50 to-pink-600/30 text-white border-l-4 border-purple-400 shadow-lg"
                            : "text-gray-300 hover:bg-purple-600/20 hover:text-white hover:border-l-2 hover:border-purple-400/50"
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            // Collapsed categories - show only icons
            <div className="space-y-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;

                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    className={`w-full p-3 h-10 flex justify-center rounded-lg transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600/50 to-pink-600/30 text-white border-l-4 border-purple-400 shadow-lg"
                        : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                    title={category.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Genres Section */}
        <div className="mb-4">
          {!isCollapsed ? (
            <>
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-purple-600/20 p-3 h-auto mb-3 rounded-lg border border-purple-500/20"
                onClick={() => toggleSection("genres")}
              >
                <span className="font-semibold text-sm text-purple-200">Genres</span>
                {expandedSections.genres ? (
                  <ChevronDown className="h-4 w-4 text-purple-300" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-purple-300" />
                )}
              </Button>

              {expandedSections.genres && (
                <div className="space-y-1 max-h-80 overflow-y-auto ml-2 pr-2 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
                  {genresLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gradient-to-r from-purple-700/30 to-pink-700/20 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    genresData?.genres?.map((genre) => {
                      const isSelected = selectedGenre === genre.id;
                      const GenreIcon = getGenreIcon(genre.name);

                      return (
                        <Button
                          key={genre.id}
                          variant="ghost"
                          className={`w-full justify-start text-left p-2 h-auto text-sm rounded-lg transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-to-r from-purple-600/50 to-pink-600/30 text-white border-l-4 border-purple-400 shadow-lg"
                              : "text-gray-300 hover:bg-purple-600/20 hover:text-white hover:border-l-2 hover:border-purple-400/50"
                          }`}
                          onClick={() => handleGenreClick(genre.id)}
                        >
                          <GenreIcon className="h-3 w-3 mr-2" />
                          {genre.name}
                        </Button>
                      );
                    })
                  )}
                </div>
              )}
            </>
          ) : (
            // Collapsed genres - show popular genres as icons
            <div className="space-y-2">
              {!genresLoading &&
                genresData?.genres?.slice(0, 10).map((genre) => {
                  const isSelected = selectedGenre === genre.id;
                  const GenreIcon = getGenreIcon(genre.name);

                  return (
                    <Button
                      key={genre.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full p-3 h-10 flex justify-center rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600/50 to-pink-600/30 text-white border-l-4 border-purple-400 shadow-lg"
                          : "text-gray-300 hover:bg-purple-600/20 hover:text-white"
                      }`}
                      onClick={() => handleGenreClick(genre.id)}
                      title={genre.name}
                    >
                      <GenreIcon className="h-3 w-3" />
                    </Button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
