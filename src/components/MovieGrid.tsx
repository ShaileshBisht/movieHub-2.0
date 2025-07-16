"use client";

import { Movie } from "@/types/movie";
import { useMovieGrid } from "../hooks/useMovieGrid";
import MovieCard from "./ui/movie-card";
import Pagination from "./ui/pagination";
import { LoadingState, ErrorState, EmptyState } from "./ui/MovieGridStates";

interface MovieGridProps {
  category: string | null;
  genre: number | null;
  search: string | null;
  currentPage: number;
}

export default function MovieGrid({ category, genre, search, currentPage }: MovieGridProps) {
  const { currentData, isLoading, error, page, handlePageChange, getDisplayTitle } = useMovieGrid({
    category,
    genre,
    search,
    currentPage,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (!currentData?.results?.length && !isLoading) {
    return <EmptyState searchQuery={search || undefined} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <MovieGridHeader title={getDisplayTitle()} totalResults={currentData?.total_results} currentCount={currentData?.results?.length} />

      {/* Movies Grid */}
      <MovieGridContent movies={currentData?.results || []} />

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

interface MovieGridHeaderProps {
  title: string;
  totalResults?: number;
  currentCount?: number;
}

function MovieGridHeader({ title, totalResults, currentCount }: MovieGridHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          {currentCount || 0} movies on this page
          {totalResults && ` of ${totalResults.toLocaleString()} total`}
        </p>
      </div>
    </div>
  );
}

interface MovieGridContentProps {
  movies: Movie[];
}

function MovieGridContent({ movies }: MovieGridContentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {movies.map((movie: Movie, index: number) => (
        <div key={`${movie.id}-${index}`} className="w-full">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
