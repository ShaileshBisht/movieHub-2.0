"use client";

import { useState, useEffect, Suspense, use } from "react";
import {
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery,
} from "../../../store/api/tmdbApi";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "../../../components/Navbar";
import MovieHero from "../../../components/MovieHero";
import CastGrid from "../../../components/CastGrid";
import VideoCarousel from "../../../components/VideoCarousel";
import VideoModal from "../../../components/VideoModal";
import SimilarMoviesGrid from "../../../components/SimilarMoviesGrid";
import { PageLoadingSpinner } from "../../../components/LoadingSpinner";
import { useWatchlist } from "../../../hooks/useWatchlist";
import { useNavigation } from "../../../hooks/useNavigation";
import { formatCurrency } from "../../../utils/movieUtils";
import { VideoType, CastMember, CrewMember } from "../../../types/movie";
import { Button } from "@/components/ui/button";

function MovieDetailsContent({ movieId }: { movieId: string }) {
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("trending");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);
  const { data: credits } = useGetMovieCreditsQuery(movieId);
  const { data: videos } = useGetMovieVideosQuery(movieId);
  const { data: similarMovies, isLoading: similarLoading, error: similarError } = useGetSimilarMoviesQuery(movieId);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { navigateToCategory, navigateToGenre, navigateToSearch, goBack } = useNavigation();

  const cast = (credits?.cast as CastMember[]) || [];
  const crew = (credits?.crew as CrewMember[]) || [];
  const director = crew.find((person) => person.job === "Director");
  const trailer = videos?.results?.find((video: VideoType) => video.type === "Trailer");

  const handleWatchlistToggle = () => {
    if (movie) {
      toggleWatchlist(movie);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    navigateToCategory(categoryId);
  };

  const handleGenreSelect = (genreId: number | null) => {
    navigateToGenre(genreId);
  };

  const handleSearch = (query: string) => {
    navigateToSearch(query);
  };

  const handleVideoSelect = (video: VideoType) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  if (isLoading) {
    return <PageLoadingSpinner text="Loading movie details..." />;
  }

  if (error || !movie) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => navigateToCategory(null)} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
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
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation */}
        <Navbar
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onSearch={handleSearch}
          showLogo={false}
        />

        {/* Movie Details Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            {/* Hero Section */}
            <MovieHero
              movie={movie}
              trailer={trailer}
              isInWatchlist={isInWatchlist(movie.id)}
              onBack={goBack}
              onWatchTrailer={() => trailer && setSelectedVideo(trailer)}
              onToggleWatchlist={handleWatchlistToggle}
            />

            {/* Content Sections */}
            <div className="bg-black text-white">
              {/* Overview */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{movie.overview}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-400 mb-2">Director</h3>
                      <p className="text-white">{director?.name || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400 mb-2">Budget</h3>
                      <p className="text-white">{formatCurrency(movie.budget)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400 mb-2">Revenue</h3>
                      <p className="text-white">{formatCurrency(movie.revenue)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cast */}
              {cast && cast.length > 0 && (
                <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
                  <div className="max-w-6xl">
                    <CastGrid cast={cast} maxItems={12} />
                  </div>
                </div>
              )}

              {/* Videos */}
              {videos?.results && videos.results.length > 0 && (
                <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
                  <div className="max-w-6xl">
                    <VideoCarousel videos={videos.results} onVideoSelect={handleVideoSelect} title="Videos & Trailers" />
                  </div>
                </div>
              )}

              {/* Similar Movies */}
              {similarMovies?.results && similarMovies.results.length > 0 && (
                <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
                  <div className="max-w-6xl">
                    <SimilarMoviesGrid
                      movies={similarMovies.results.slice(0, 6)}
                      isLoading={similarLoading}
                      error={similarError}
                      title="Similar Movies"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={handleCloseVideo} />
    </>
  );
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="h-screen flex overflow-hidden bg-black">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <PageLoadingSpinner text="Loading movie..." />
          </div>
        }
      >
        <MovieDetailsContent movieId={resolvedParams.id} />
      </Suspense>
    </div>
  );
}
