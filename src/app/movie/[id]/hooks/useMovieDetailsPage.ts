import { useState } from "react";
import {
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery,
} from "../../../../store/api/tmdbApi";
import { useWatchlist } from "../../../../hooks/useWatchlist";
import { useNavigation } from "../../../../hooks/useNavigation";
import { VideoType, CastMember, CrewMember } from "../../../../types/movie";

export function useMovieDetailsPage(movieId: string) {
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);

  const { data: movie, isLoading, error } = useGetMovieDetailsQuery(movieId);
  const { data: credits } = useGetMovieCreditsQuery(movieId);
  const { data: videos } = useGetMovieVideosQuery(movieId);
  const { data: similarMovies, isLoading: similarLoading, error: similarError } = useGetSimilarMoviesQuery(movieId);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { goBack } = useNavigation();

  const cast = (credits?.cast as CastMember[]) || [];
  const crew = (credits?.crew as CrewMember[]) || [];
  const director = crew.find((person) => person.job === "Director");
  const trailer = videos?.results?.find((video: VideoType) => video.type === "Trailer");

  const handleWatchlistToggle = () => {
    if (movie) {
      toggleWatchlist(movie);
    }
  };

  const handleVideoSelect = (video: VideoType) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleWatchTrailer = () => {
    if (trailer) {
      setSelectedVideo(trailer);
    }
  };

  return {
    // Data
    movie,
    cast,
    director,
    videos: videos?.results || [],
    similarMovies: similarMovies?.results || [],

    // Loading states
    isLoading,
    similarLoading,

    // Errors
    error,
    similarError,

    // Computed values
    trailer,
    isInWatchlist: movie ? isInWatchlist(movie.id) : false,

    // Handlers
    handleWatchlistToggle,
    handleVideoSelect,
    handleCloseVideo,
    handleWatchTrailer,
    goBack,

    // State
    selectedVideo,
  };
}
