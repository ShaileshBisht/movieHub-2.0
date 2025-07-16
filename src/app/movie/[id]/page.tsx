"use client";

import { Suspense, use } from "react";
import MovieDetailsLayout from "../../../components/movie/MovieDetailsLayout";
import MovieHero from "../../../components/MovieHero";
import MovieOverview from "../../../components/movie/MovieOverview";
import MovieContentSections from "../../../components/movie/MovieContentSections";
import VideoModal from "../../../components/VideoModal";
import { PageLoadingSpinner } from "../../../components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useMovieDetailsPage } from "./hooks";

function MovieDetailsContent({ movieId }: { movieId: string }) {
  const {
    movie,
    cast,
    director,
    videos,
    similarMovies,
    isLoading,
    similarLoading,
    error,
    similarError,
    trailer,
    isInWatchlist,
    handleWatchlistToggle,
    handleVideoSelect,
    handleCloseVideo,
    handleWatchTrailer,
    goBack,
    selectedVideo,
  } = useMovieDetailsPage(movieId);

  if (isLoading) {
    return <PageLoadingSpinner text="Loading movie details..." />;
  }

  if (error || !movie) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={goBack} variant="outline">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <MovieDetailsLayout>
      <div className="relative">
        {/* Hero Section */}
        <MovieHero
          movie={movie}
          trailer={trailer}
          isInWatchlist={isInWatchlist}
          onBack={goBack}
          onWatchTrailer={handleWatchTrailer}
          onToggleWatchlist={handleWatchlistToggle}
        />

        {/* Overview Section */}
        <MovieOverview movie={movie} director={director} />

        {/* Content Sections */}
        <MovieContentSections
          cast={cast}
          videos={videos}
          similarMovies={similarMovies}
          similarLoading={similarLoading}
          similarError={similarError}
          onVideoSelect={handleVideoSelect}
        />
      </div>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={handleCloseVideo} />
    </MovieDetailsLayout>
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
