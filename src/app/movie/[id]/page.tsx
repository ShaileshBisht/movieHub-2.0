"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import {
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery,
} from "../../../store/api/tmdbApi";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Star, Calendar, Clock, Play, Heart, ArrowLeft, Globe, DollarSign, ChevronDown } from "lucide-react";
import Sidebar from "../../../components/ui/sidebar";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "../../../utils/watchlist";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
  budget: number;
  revenue: number;
  homepage: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  imdb_id: string | null;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Country {
  iso_3166_1: string;
  name: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatReleaseDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function MovieDetailsContent({ movieId }: { movieId: string }) {
  const router = useRouter();
  const { data: movie, isLoading: movieLoading } = useGetMovieDetailsQuery(movieId);
  const { data: credits } = useGetMovieCreditsQuery(parseInt(movieId));
  const { data: videos } = useGetMovieVideosQuery(parseInt(movieId));
  const { data: similarMovies } = useGetSimilarMoviesQuery(parseInt(movieId));

  // State for trailer modal
  const [showTrailer, setShowTrailer] = useState(false);
  // State for sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(256); // 64 * 4 = 256px for w-64
  // State for watchlist
  const [inWatchlist, setInWatchlist] = useState(false);

  // Check if movie is in watchlist on mount and when movie changes
  useEffect(() => {
    if (movie) {
      setInWatchlist(isInWatchlist(movie.id));
    }
  }, [movie]);

  // Listen for watchlist updates
  useEffect(() => {
    const handleWatchlistUpdate = () => {
      if (movie) {
        setInWatchlist(isInWatchlist(movie.id));
      }
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
  }, [movie]);

  // Sidebar handlers
  const handleCategorySelect = (category: string) => {
    router.push(`/?category=${category}`);
  };

  const handleGenreSelect = (genreId: number) => {
    router.push(`/?genre=${genreId}`);
  };

  const handleBackClick = () => {
    // Go back to home page with trending movies - use replace to clear history
    router.replace("/");
  };

  // Handle sidebar width changes
  const handleSidebarToggle = (isCollapsed: boolean) => {
    setSidebarWidth(isCollapsed ? 64 : 256); // w-16 = 64px, w-64 = 256px
  };

  // Handle watchlist toggle
  const handleWatchlistToggle = () => {
    if (!movie) return;

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Movie not found</h1>
          <Button onClick={handleBackClick} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const trailer = videos?.results?.find((video: Video) => video.type === "Trailer" && video.site === "YouTube");
  const cast = credits?.cast?.slice(0, 12) || [];

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

        {/* Main Content - Account for sidebar width */}
        <div className="flex-1 w-full overflow-y-auto transition-all duration-300 ease-in-out" style={{ marginLeft: `${sidebarWidth}px` }}>
          {/* Hero Section */}
          <div className="relative min-h-screen w-full">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
              style={{
                backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 w-full h-full" />

            {/* Content */}
            <div className="relative min-h-screen flex items-center w-full py-20">
              <div className="container mx-auto px-4 w-full max-w-none">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img src={getImageUrl(movie.poster_path, "w500")} alt={movie.title} className="w-80 h-auto rounded-2xl shadow-2xl" />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Title */}
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

                    {/* Tagline */}
                    {movie.tagline && <p className="text-xl text-purple-200 italic mb-6">&quot;{movie.tagline}&quot;</p>}

                    {/* Rating and Info */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                      <Badge className="bg-yellow-500 text-black text-lg px-3 py-1">
                        <Star className="w-5 h-5 mr-1" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>

                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="text-lg">{formatReleaseDate(movie.release_date)}</span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="text-lg">{formatRuntime(movie.runtime)}</span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                      {movie.genres.map((genre: Genre) => (
                        <Badge key={genre.id} variant="outline" className="border-purple-400 text-purple-200">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Overview */}
                    <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-3xl">{movie.overview}</p>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-center lg:justify-start gap-4 w-full">
                      {/* First Row - External Links */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        {movie.homepage && (
                          <Button
                            onClick={() => window.open(movie.homepage, "_blank")}
                            className="bg-blue-600/80 hover:bg-blue-600 text-white border-blue-400 px-6 py-3 text-sm font-semibold backdrop-blur-sm"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            WEBSITE
                          </Button>
                        )}

                        <Button
                          onClick={() => window.open(`https://www.imdb.com/title/${movie.imdb_id || ""}`, "_blank")}
                          className="bg-yellow-600/80 hover:bg-yellow-600 text-white border-yellow-400 px-6 py-3 text-sm font-semibold backdrop-blur-sm"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          IMDB
                        </Button>

                        {trailer && (
                          <Button
                            onClick={() => setShowTrailer(true)}
                            className="bg-red-600/80 hover:bg-red-600 text-white border-red-400 px-6 py-3 text-sm font-semibold backdrop-blur-sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            TRAILER
                          </Button>
                        )}
                      </div>

                      {/* Second Row - User Actions */}
                      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                        <Button className="bg-pink-600/80 hover:bg-pink-600 text-white border-pink-400 px-6 py-3 text-sm font-semibold backdrop-blur-sm">
                          <Heart className="w-4 h-4 mr-2" />
                          FAVORITE
                        </Button>

                        <Button
                          onClick={handleWatchlistToggle}
                          className={`${
                            inWatchlist
                              ? "bg-green-600/80 hover:bg-green-600 border-green-400"
                              : "bg-purple-600/80 hover:bg-purple-600 border-purple-400"
                          } text-white px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-200`}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {inWatchlist ? "IN WATCHLIST ✓" : "WATCHLIST +1"}
                        </Button>

                        <Button
                          onClick={handleBackClick}
                          className="bg-gray-600/80 hover:bg-gray-600 text-white border-gray-400 px-6 py-3 text-sm font-semibold backdrop-blur-sm"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          BACK
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div
                className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer"
                onClick={() => {
                  const castSection = document.getElementById("cast-section");
                  castSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="text-sm mb-2 font-medium">Scroll for more</span>
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Trailer Modal */}
          {showTrailer && trailer && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                ></iframe>
              </div>
            </div>
          )}

          {/* Cast & Details Section */}
          <div className="py-16" id="cast-section">
            <div className="container mx-auto px-4">
              {/* Cast Section */}
              <div className="mb-16">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">Cast & Crew</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {cast.map((person: Cast) => (
                    <Card
                      key={person.id}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={getImageUrl(person.profile_path, "w300")}
                            alt={person.name}
                            className="w-full h-64 object-cover rounded-t-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-person.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-lg" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-1 text-white">{person.name}</h3>
                          <p className="text-xs text-purple-300 font-medium">{person.character}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Movie Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-white mb-6">Movie Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <DollarSign className="w-6 h-6 mr-3 text-green-400" />
                          <span className="font-semibold text-lg">Budget</span>
                        </div>
                        <p className="text-2xl font-bold">{movie.budget ? formatCurrency(movie.budget) : "N/A"}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <DollarSign className="w-6 h-6 mr-3 text-yellow-400" />
                          <span className="font-semibold text-lg">Revenue</span>
                        </div>
                        <p className="text-2xl font-bold">{movie.revenue ? formatCurrency(movie.revenue) : "N/A"}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Globe className="w-6 h-6 mr-3 text-blue-400" />
                          <span className="font-semibold text-lg">Status</span>
                        </div>
                        <p className="text-xl">{movie.status}</p>
                      </CardContent>
                    </Card>

                    {movie.production_countries.length > 0 && (
                      <Card className="bg-white/10 border-white/20 text-white">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-3">
                            <Globe className="w-6 h-6 mr-3 text-purple-400" />
                            <span className="font-semibold text-lg">Countries</span>
                          </div>
                          <div className="space-y-2">
                            {movie.production_countries.map((country: Country) => (
                              <Badge key={country.iso_3166_1} variant="secondary" className="bg-purple-600/30 text-purple-200 mr-2">
                                {country.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Additional Info Sidebar */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Additional Info</h2>
                  <div className="space-y-4">
                    {movie.homepage && (
                      <Card className="bg-white/10 border-white/20 text-white">
                        <CardContent className="p-4">
                          <Button
                            onClick={() => window.open(movie.homepage, "_blank")}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Official Website
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {movie.production_companies.length > 0 && (
                      <Card className="bg-white/10 border-white/20 text-white">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3">Production Companies</h3>
                          <div className="space-y-2">
                            {movie.production_companies.slice(0, 5).map((company: ProductionCompany) => (
                              <div key={company.id} className="flex items-center space-x-2">
                                {company.logo_path && (
                                  <img src={getImageUrl(company.logo_path, "w92")} alt={company.name} className="w-8 h-8 object-contain" />
                                )}
                                <span className="text-sm">{company.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similarMovies?.results && similarMovies.results.length > 0 && (
            <div className="py-16 border-t border-white/10">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-8">Similar Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {similarMovies.results.slice(0, 12).map((movie: SimilarMovie) => (
                    <Card
                      key={movie.id}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                      onClick={() => router.push(`/movie/${movie.id}`)}
                    >
                      <CardContent className="p-0">
                        <img
                          src={getImageUrl(movie.poster_path)}
                          alt={movie.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-movie.jpg";
                          }}
                        />
                        <div className="p-3">
                          <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
                          <div className="flex items-center mt-2">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            <span className="text-xs">{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = params.id as string;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      }
    >
      <MovieDetailsContent movieId={movieId} />
    </Suspense>
  );
}
