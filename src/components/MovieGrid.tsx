"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  useGetTrendingMoviesQuery,
  useGetMoviesByCategoryQuery,
  useGetMoviesByGenreQuery,
  useSearchMoviesQuery,
  tmdbApi,
} from "../store/api/tmdbApi";
import MovieCard from "./ui/movie-card";
import { Movie } from "@/types/movie";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Determine which query to use
  const shouldSkipTrending = !!(category && category !== "trending") || !!genre || !!search;
  const shouldSkipCategory = !category || category === "trending" || !!genre || !!search;
  const shouldSkipGenre = !genre || !!search;
  const shouldSkipSearch = !search;

  // API Queries
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useGetTrendingMoviesQuery(
    { page },
    {
      skip: shouldSkipTrending,
      refetchOnMountOrArgChange: 30,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetMoviesByCategoryQuery(
    { category: category!, page },
    {
      skip: shouldSkipCategory,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: genreData,
    isLoading: genreLoading,
    error: genreError,
  } = useGetMoviesByGenreQuery(
    { genreId: genre!, page },
    {
      skip: shouldSkipGenre,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchMoviesQuery(
    { query: search!, page },
    {
      skip: shouldSkipSearch,
      refetchOnMountOrArgChange: true,
    }
  );

  // Get current data and loading state
  const currentData = search ? searchData : genre ? genreData : category && category !== "trending" ? categoryData : trendingData;
  const isLoading = search ? searchLoading : genre ? genreLoading : category && category !== "trending" ? categoryLoading : trendingLoading;
  const error = search ? searchError : genre ? genreError : category && category !== "trending" ? categoryError : trendingError;

  // Reset state when route changes
  useEffect(() => {
    setAllMovies([]);
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [category, genre, search]);

  // Update movies when data changes
  useEffect(() => {
    if (currentData?.results) {
      if (page === 1) {
        setAllMovies(currentData.results);
      } else {
        setAllMovies((prev) => [...prev, ...currentData.results]);
      }
      setHasMore(page < (currentData.total_pages || 1));
      setIsLoadingMore(false);
    }
  }, [currentData, page]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [isLoadingMore, hasMore, isLoading]);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (currentLoadingRef) {
      observerRef.current.observe(currentLoadingRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  // Get display title
  const getDisplayTitle = () => {
    if (search) return `Search Results for "${search}"`;
    if (genre) return "Movies by Genre";
    if (category) {
      switch (category) {
        case "trending":
          return "Trending Movies";
        case "popular":
          return "Popular Movies";
        case "top_rated":
          return "Top Rated Movies";
        case "now_playing":
          return "Now Playing";
        case "upcoming":
          return "Upcoming Movies";
        default:
          return "Movies";
      }
    }
    return "Trending Movies";
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-purple-500" />
        <p className="text-gray-400 text-sm sm:text-base">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4">
        <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">
            We couldn't load the movies. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!allMovies.length && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 px-4">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No movies found</h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">
            {search ? `No results found for "${search}". Try a different search term.` : "No movies available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{getDisplayTitle()}</h2>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            {allMovies.length} movie{allMovies.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {allMovies.map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="w-full">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Loading More Indicator */}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center py-6 sm:py-8">
          {isLoadingMore && (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-purple-500" />
              <span className="text-gray-400 text-sm sm:text-base">Loading more movies...</span>
            </div>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && allMovies.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-400 text-sm sm:text-base">You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
}
