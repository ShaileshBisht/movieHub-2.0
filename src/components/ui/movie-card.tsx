"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Calendar, Heart, Play } from "lucide-react";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const formatReleaseDate = (dateString: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

const trimDescription = (text: string, maxLength: number = 120) => {
  if (!text) return "No description available.";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Check if movie is in watchlist
  useState(() => {
    const watchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    setIsInWatchlist(watchlist.some((item: Movie) => item.id === movie.id));
  });

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const watchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    let updatedWatchlist;

    if (isInWatchlist) {
      updatedWatchlist = watchlist.filter((item: Movie) => item.id !== movie.id);
    } else {
      updatedWatchlist = [...watchlist, movie];
    }

    localStorage.setItem("movieWatchlist", JSON.stringify(updatedWatchlist));
    setIsInWatchlist(!isInWatchlist);

    // Dispatch custom event to update watchlist count
    window.dispatchEvent(new CustomEvent("watchlistUpdated"));
  };

  return (
    <div
      className="group relative bg-gray-900/50 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10"
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, "w780")}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = getImageUrl(movie.poster_path);
            setIsImageLoaded(true);
          }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-white">
            <Play className="w-8 h-8 fill-current" />
            <span className="text-lg font-semibold">Watch Now</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Watchlist Button */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isInWatchlist ? "bg-red-500/90 text-white" : "bg-black/60 text-white hover:bg-red-500/90"
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWatchlist ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Movie Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors min-h-[3.5rem]">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatReleaseDate(movie.release_date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>{movie.vote_count.toLocaleString()} votes</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed min-h-[4rem] group-hover:text-gray-200 transition-colors">
          {trimDescription(movie.overview)}
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400 rounded-lg py-2.5 px-4 font-medium transition-all duration-200 flex items-center justify-center space-x-2">
            <Play className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
}
