import { CastMember, VideoType, Movie } from "../../types/movie";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import CastGrid from "../CastGrid";
import VideoCarousel from "../VideoCarousel";
import SimilarMoviesGrid from "../SimilarMoviesGrid";

interface MovieContentSectionsProps {
  cast: CastMember[];
  videos: VideoType[];
  similarMovies: Movie[];
  similarLoading: boolean;
  similarError: FetchBaseQueryError | SerializedError | undefined;
  onVideoSelect: (video: VideoType) => void;
}

export default function MovieContentSections({
  cast,
  videos,
  similarMovies,
  similarLoading,
  similarError,
  onVideoSelect,
}: MovieContentSectionsProps) {
  return (
    <div className="bg-black text-white">
      {/* Cast */}
      {cast && cast.length > 0 && (
        <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
          <div className="max-w-6xl">
            <CastGrid cast={cast} maxItems={12} />
          </div>
        </div>
      )}

      {/* Videos */}
      {videos && videos.length > 0 && (
        <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
          <div className="max-w-6xl">
            <VideoCarousel videos={videos} onVideoSelect={onVideoSelect} title="Videos & Trailers" />
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies && similarMovies.length > 0 && (
        <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-800">
          <div className="max-w-6xl">
            <SimilarMoviesGrid movies={similarMovies.slice(0, 6)} isLoading={similarLoading} error={similarError} title="Similar Movies" />
          </div>
        </div>
      )}
    </div>
  );
}
