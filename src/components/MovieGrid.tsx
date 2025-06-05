"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetTrendingMoviesQuery,
  useGetMoviesByCategoryQuery,
  useGetMoviesByGenreQuery,
  useSearchMoviesQuery,
} from "../store/api/tmdbApi";
import MovieCard from "./ui/movie-card";
import Pagination from "./ui/pagination";
import { Movie } from "@/types/movie";

interface MovieGridProps {
  category: string | null;
  genre: number | null;
  search: string | null;
  currentPage: number;
}

export default function MovieGrid({ category, genre, search, currentPage }: MovieGridProps) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage || 1);

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
  } = useGetTrendingMoviesQuery(
    { page },
    {
      skip: shouldSkipTrending,
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
    }
  );

  // Get current data and loading state
  const currentData = search ? searchData : genre ? genreData : category && category !== "trending" ? categoryData : trendingData;
  const isLoading = search ? searchLoading : genre ? genreLoading : category && category !== "trending" ? categoryLoading : trendingLoading;
  const error = search ? searchError : genre ? genreError : category && category !== "trending" ? categoryError : trendingError;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, genre, search]);

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Update URL with new page
    const params = new URLSearchParams();
    if (category && category !== "trending") params.set("category", category);
    if (genre) params.set("genre", genre.toString());
    if (search) params.set("search", search);
    if (newPage > 1) params.set("page", newPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : "/";
    router.push(newUrl, { scroll: false });
  };

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

  if (isLoading) {
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
            We couldn&apos;t load the movies. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!currentData?.results?.length && !isLoading) {
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
            {currentData?.results?.length || 0} movies on this page
            {currentData?.total_results && ` of ${currentData.total_results.toLocaleString()} total`}
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {currentData?.results?.map((movie: Movie, index: number) => (
          <div key={`${movie.id}-${index}`} className="w-full">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {currentData && (
        <Pagination
          currentPage={page}
          totalPages={currentData.total_pages || 1}
          totalResults={currentData.total_results}
          maxPages={100}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
