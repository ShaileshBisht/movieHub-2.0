"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetUpcomingMoviesQuery,
  useDiscoverMoviesQuery,
  useSearchMoviesQuery,
  tmdbApi,
} from "../store/api/tmdbApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieGridProps {
  category: string | null;
  genre: number | null;
  search: string | null;
  currentPage: number;
}

const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const formatReleaseDate = (dateString: string) => {
  return new Date(dateString).getFullYear();
};

export default function MovieGrid({ category, genre, search, currentPage }: MovieGridProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use currentPage from URL as the source of truth
  const page = currentPage;

  // Determine if we should skip trending movies
  // Show trending movies when: no category (home page) OR category is explicitly "trending"
  // Skip trending movies when: we have a genre, search, or a different category
  const shouldSkipTrending = Boolean(genre) || Boolean(search) || (category !== null && category !== "trending");

  // Conditional API calls - only call the API that's needed
  const {
    data: trendingData,
    isLoading: isTrendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useGetTrendingMoviesQuery("week", {
    skip: shouldSkipTrending,
    refetchOnMountOrArgChange: true, // Always refetch on mount
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: popularData, isLoading: isPopularLoading } = useGetPopularMoviesQuery(page, {
    skip: category !== "popular" || !!genre || !!search,
  });

  const { data: topRatedData, isLoading: isTopRatedLoading } = useGetTopRatedMoviesQuery(page, {
    skip: category !== "top_rated" || !!genre || !!search,
  });

  const { data: nowPlayingData, isLoading: isNowPlayingLoading } = useGetNowPlayingMoviesQuery(page, {
    skip: category !== "now_playing" || !!genre || !!search,
  });

  const { data: upcomingData, isLoading: isUpcomingLoading } = useGetUpcomingMoviesQuery(page, {
    skip: category !== "upcoming" || !!genre || !!search,
  });

  const { data: discoverData, isLoading: isDiscoverLoading } = useDiscoverMoviesQuery(
    { with_genres: genre, page },
    {
      skip: !genre || !!search,
    }
  );

  const { data: searchData, isLoading: isSearchLoading } = useSearchMoviesQuery(
    { query: search!, page },
    {
      skip: !search,
    }
  );

  // Get current data and loading state
  const getCurrentData = () => {
    if (search && searchData) {
      return { data: searchData, isLoading: isSearchLoading };
    }
    if (genre && discoverData) {
      return { data: discoverData, isLoading: isDiscoverLoading };
    }

    switch (category) {
      case "popular":
        return { data: popularData, isLoading: isPopularLoading };
      case "top_rated":
        return { data: topRatedData, isLoading: isTopRatedLoading };
      case "now_playing":
        return { data: nowPlayingData, isLoading: isNowPlayingLoading };
      case "upcoming":
        return { data: upcomingData, isLoading: isUpcomingLoading };
      case "trending":
        return { data: trendingData, isLoading: isTrendingLoading };
      case null:
      case undefined:
      default:
        // Default to trending when no category is specified
        return { data: trendingData, isLoading: isTrendingLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();

  // Update movies when new data comes in
  useEffect(() => {
    if (currentData?.results) {
      if (page === 1) {
        // First page - replace all movies
        setAllMovies(currentData.results);
      } else {
        // Subsequent pages - append new movies
        setAllMovies((prev) => {
          const existingIds = new Set(prev.map((movie: Movie) => movie.id));
          const uniqueNewMovies = currentData.results.filter((movie: Movie) => !existingIds.has(movie.id));
          return [...prev, ...uniqueNewMovies];
        });
      }
      setIsLoadingMore(false);
    }
  }, [currentData, page, category]);

  // Reset when route changes (category, genre, or search) - but not when going to home
  useEffect(() => {
    // Reset movies when we have active filters (not on home page)
    // Home page is when category=null, genre=null, search=null
    const isHomePage = category === null && genre === null && search === null;
    const hasActiveFilters = category !== null || genre !== null || search !== null;

    if (hasActiveFilters) {
      setAllMovies([]);
      setIsLoadingMore(false);
    } else if (isHomePage) {
    }
  }, [category, genre, search]);

  // Force refresh when returning to default home page
  useEffect(() => {
    if (!category && !genre && !search && refetchTrending) {
      refetchTrending();
    }
  }, [category, genre, search]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (isLoadingMore || isLoading) return;

    // Check if we have more pages to load
    if (currentData && page >= currentData.total_pages) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 500) {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      // Update URL with new page
      const params = new URLSearchParams(window.location.search);
      params.set("page", nextPage.toString());
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [isLoadingMore, isLoading, page, currentData, router]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const getPageTitle = () => {
    if (search) return `Search Results for "${search}"`;
    if (genre) return "Movies by Genre";

    switch (category) {
      case "popular":
        return "Popular Movies";
      case "top_rated":
        return "Top Rated Movies";
      case "now_playing":
        return "Now Playing";
      case "upcoming":
        return "Upcoming Movies";
      default:
        return "Trending Movies";
    }
  };

  const displayedMovies = allMovies;

  return (
    <>
      {/* Featured Movie Hero Section */}
      {!isLoading && displayedMovies.length > 0 && page === 1 && (
        <section className="relative mb-12 mx-4">
          <div
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/movie/${displayedMovies[0].id}`)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${getImageUrl(displayedMovies[0].poster_path, "original")})`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-8">
                <div className="max-w-2xl">
                  <Badge className="mb-4 bg-yellow-500 text-black text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    {displayedMovies[0].vote_average.toFixed(1)} • Featured
                  </Badge>

                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{displayedMovies[0].title}</h1>

                  <div className="flex items-center text-gray-300 mb-6">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-lg">{formatReleaseDate(displayedMovies[0].release_date)}</span>
                  </div>

                  <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">{displayedMovies[0].overview}</p>

                  <div className="flex gap-4">
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/movie/${displayedMovies[0].id}`);
                      }}
                    >
                      <Star className="w-5 h-5 mr-2 inline" />
                      Watch Now
                    </button>
                    <button
                      className="border border-purple-500/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 px-8 py-3 text-lg font-semibold rounded-lg backdrop-blur-sm transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/movie/${displayedMovies[0].id}`);
                      }}
                    >
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movies Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">
              {page === 1 && displayedMovies.length > 1 ? `More ${getPageTitle()}` : getPageTitle()}
              {page > 1 && <span className="text-purple-400 ml-2">- Page {page}</span>}
            </h3>
          </div>

          {/* Loading State */}
          {isLoading && page === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 rounded-lg h-96 mb-4"></div>
                  <div className="bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-700 rounded h-4 w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {trendingError && (category === "trending" || category === null) && (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">Failed to load movies. Please try again later.</p>
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && displayedMovies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(page === 1 ? displayedMovies.slice(1) : displayedMovies).map((movie: Movie) => (
                <Card
                  key={movie.id}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-movie.jpg";
                        }}
                      />
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                        <Star className="w-3 h-3 mr-1" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{movie.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatReleaseDate(movie.release_date)}
                    </div>
                    <CardDescription className="text-gray-300 line-clamp-3">{movie.overview}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <div className="flex items-center space-x-2 text-purple-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                <span className="text-lg">Loading more movies...</span>
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && displayedMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {search
                  ? `No movies found for "${search}". Try a different search term.`
                  : "No movies found. Try selecting a different category or genre."}
              </p>
            </div>
          )}

          {/* End of Results */}
          {!isLoading && !isLoadingMore && currentData && page >= currentData.total_pages && displayedMovies.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">You&apos;ve reached the end! Showing all {currentData.total_results} results.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
