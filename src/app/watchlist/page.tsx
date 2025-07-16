"use client";

import { Heart, Star, Calendar, Trash2, Play } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "../../components/Navbar";
import { PageLoadingSpinner } from "../../components/LoadingSpinner";
import { getImageUrl } from "../../utils/movieUtils";
import { Movie } from "../../types/movie";
import { Button } from "@/components/ui/button";
import { useWatchlistPage } from "./hooks";

export default function WatchlistPage() {
  const {
    isSidebarOpen,
    selectedCategory,
    selectedGenre,
    isLoading,
    watchlist,
    handleMovieClick,
    handleRemoveFromWatchlist,
    handleClearWatchlist,
    handleCategorySelect,
    handleGenreSelect,
    handleSearch,
    toggleSidebar,
    closeSidebar,
    navigateToHome,
  } = useWatchlistPage();

  if (isLoading) {
    return <PageLoadingSpinner text="Loading your watchlist..." />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-black">
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
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation */}
        <Navbar onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} onSearch={handleSearch} />

        {/* Watchlist Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8 sm:mb-12">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500 fill-current" />
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">My Watchlist</h1>
                    <p className="text-gray-300 text-sm sm:text-base lg:text-lg mt-2">
                      {watchlist.length === 0
                        ? "Your watchlist is empty. Start adding movies you want to watch!"
                        : `You have ${watchlist.length} movie${watchlist.length === 1 ? "" : "s"} in your watchlist`}
                    </p>
                  </div>
                </div>

                {watchlist.length > 0 && (
                  <Button onClick={handleClearWatchlist} variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear All</span>
                  </Button>
                )}
              </div>

              {/* Empty State */}
              {watchlist.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                      <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl sm:text-2xl font-semibold text-white">No movies in your watchlist yet</h2>
                      <p className="text-gray-400 text-sm sm:text-base">
                        Browse movies and click the heart icon to add them to your watchlist
                      </p>
                    </div>
                    <Button onClick={navigateToHome} className="bg-purple-600 hover:bg-purple-700">
                      Browse Movies
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Movies Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {watchlist.map((movie: Movie) => (
                      <div key={movie.id} className="group cursor-pointer" onClick={() => handleMovieClick(movie.id)}>
                        <div className="relative overflow-hidden rounded-lg mb-3 aspect-[2/3] bg-gray-800">
                          <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.png";
                            }}
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                          </div>

                          {/* Rating Badge */}
                          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => handleRemoveFromWatchlist(movie.id, e)}
                            className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Remove from watchlist"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </button>

                          {/* Release Year */}
                          {movie.release_date && (
                            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-300" />
                                <span className="text-white text-xs font-medium">{new Date(movie.release_date).getFullYear()}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Movie Info */}
                        <div className="space-y-1">
                          <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {movie.title}
                          </h3>
                          {movie.overview && <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{movie.overview}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Watchlist Stats */}
                  <div className="text-center">
                    <div className="bg-white/10 rounded-lg p-4 sm:p-6 lg:p-8 max-w-md mx-auto">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Watchlist Stats</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold text-purple-400">{watchlist.length}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">Total Movies</p>
                        </div>
                        <div>
                          <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                            {watchlist.length > 0
                              ? (watchlist.reduce((sum, movie) => sum + movie.vote_average, 0) / watchlist.length).toFixed(1)
                              : "0.0"}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">Avg Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
