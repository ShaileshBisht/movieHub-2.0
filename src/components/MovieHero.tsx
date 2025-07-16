"use client";

import { ArrowLeft, Star, Play, Check, Plus } from "lucide-react";
import { Movie, VideoType, Genre } from "../types/movie";
import { getImageUrl, formatRuntime, formatReleaseDate } from "../utils/movieUtils";
import { Button } from "./ui/button";

interface MovieHeroProps {
  movie: Movie;
  trailer?: VideoType;
  isInWatchlist: boolean;
  onBack?: () => void;
  onWatchTrailer?: () => void;
  onToggleWatchlist?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export default function MovieHero({
  movie,
  trailer,
  isInWatchlist,
  onBack,
  onWatchTrailer,
  onToggleWatchlist,
  showBackButton = true,
  className = "",
}: MovieHeroProps) {
  return (
    <div className={`relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Back Button */}
      {showBackButton && onBack && (
        <div className="absolute top-4 left-4 z-10">
          <Button onClick={onBack} variant="outline" size="sm" className="bg-black/50 border-white/20 text-white hover:bg-black/70">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Movie Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">{movie.title}</h1>

          {/* Tagline */}
          {movie.tagline && <p className="text-lg sm:text-xl text-gray-300 mb-4 italic">{movie.tagline}</p>}

          {/* Movie Stats */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}/10</span>
            </div>
            <span className="text-gray-300">{formatReleaseDate(movie.release_date)}</span>
            {movie.runtime && <span className="text-gray-300">{formatRuntime(movie.runtime)}</span>}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres?.map((genre: Genre) => (
              <span key={genre.id} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                {genre.name}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {trailer && onWatchTrailer && (
              <Button onClick={onWatchTrailer} className="bg-red-600 hover:bg-red-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                Watch Trailer
              </Button>
            )}

            {onToggleWatchlist && (
              <Button
                onClick={onToggleWatchlist}
                variant="outline"
                className={`border-2 transition-all duration-200 ${
                  isInWatchlist
                    ? "bg-green-600/90 border-green-500 text-white hover:bg-green-700/90 hover:border-green-400"
                    : "bg-purple-600/90 border-purple-500 text-white hover:bg-purple-700/90 hover:border-purple-400"
                } backdrop-blur-sm`}
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
