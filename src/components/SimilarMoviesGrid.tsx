"use client";

import { Loader2, AlertCircle } from "lucide-react";
import MovieCard from "./ui/movie-card";
import { Movie } from "@/types/movie";

interface SimilarMoviesGridProps {
  movies: Movie[];
  isLoading: boolean;
  error?: any;
  title?: string;
}

export default function SimilarMoviesGrid({ movies, isLoading, error, title = "Similar Movies" }: SimilarMoviesGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] space-y-4">
        <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-purple-500" />
        <p className="text-gray-400 text-sm sm:text-base">Loading similar movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] space-y-4 px-4">
        <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">We couldn't load similar movies. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] space-y-4 px-4">
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No similar movies found</h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">We couldn't find any similar movies at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            {movies.length} movie{movies.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {movies.map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="w-full">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
