"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Trash2, ArrowLeft, Heart } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import { getWatchlist, removeFromWatchlist, clearWatchlist } from "@/utils/watchlist";

interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
  addedAt: string;
}

const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const formatReleaseDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAddedDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isLoading, setIsLoading] = useState(true);

  // Load watchlist from localStorage
  useEffect(() => {
    const loadWatchlist = () => {
      const savedWatchlist = getWatchlist();
      setWatchlist(savedWatchlist);
      setIsLoading(false);
    };

    loadWatchlist();

    // Listen for watchlist updates
    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
  }, []);

  // Sidebar handlers
  const handleCategorySelect = (category: string) => {
    router.push(`/?category=${category}`);
  };

  const handleGenreSelect = (genreId: number) => {
    router.push(`/?genre=${genreId}`);
  };

  const handleSidebarToggle = (isCollapsed: boolean) => {
    setSidebarWidth(isCollapsed ? 64 : 256);
  };

  const handleRemoveFromWatchlist = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(movieId);
  };

  const handleClearWatchlist = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      clearWatchlist();
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handleBackClick = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        {/* Sidebar - Fixed Position */}
        <div className="fixed left-0 top-0 z-40">
          <Sidebar
            onCategorySelect={handleCategorySelect}
            onGenreSelect={handleGenreSelect}
            selectedCategory={null}
            selectedGenre={null}
            onToggle={handleSidebarToggle}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full overflow-y-auto transition-all duration-300 ease-in-out" style={{ marginLeft: `${sidebarWidth}px` }}>
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-30">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button onClick={handleBackClick} variant="ghost" className="text-white hover:bg-purple-600/20 p-2">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                      <Heart className="w-8 h-8 text-pink-400" />
                      My Watchlist
                    </h1>
                    <p className="text-purple-200 mt-1">
                      {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
                    </p>
                  </div>
                </div>

                {watchlist.length > 0 && (
                  <Button
                    onClick={handleClearWatchlist}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="container mx-auto px-4 py-8">
            {watchlist.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <Heart className="w-24 h-24 text-purple-400/50 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Start adding movies to your watchlist by clicking the &quot;WATCHLIST +1&quot; button on any movie details page.
                </p>
                <Button onClick={handleBackClick} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                  Discover Movies
                </Button>
              </div>
            ) : (
              // Movies Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlist.map((movie) => (
                  <Card
                    key={movie.id}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <CardHeader className="p-0 relative">
                      <div className="relative">
                        <img
                          src={getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-movie.jpg";
                          }}
                        />

                        {/* Rating Badge */}
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                          <Star className="w-3 h-3 mr-1" />
                          {movie.vote_average.toFixed(1)}
                        </Badge>

                        {/* Remove Button */}
                        <Button
                          onClick={(e) => handleRemoveFromWatchlist(movie.id, e)}
                          className="absolute top-2 left-2 bg-red-500/80 hover:bg-red-500 text-white p-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          size="sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{movie.title}</CardTitle>

                      {/* Release Date */}
                      <div className="flex items-center text-sm text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatReleaseDate(movie.release_date)}
                      </div>

                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {movie.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre.id} variant="outline" className="border-purple-400/50 text-purple-200 text-xs">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Overview */}
                      <p className="text-gray-300 text-sm line-clamp-3 mb-3">{movie.overview}</p>

                      {/* Added Date */}
                      <p className="text-xs text-purple-300">Added {formatAddedDate(movie.addedAt)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
