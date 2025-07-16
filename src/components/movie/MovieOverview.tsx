import { Movie, CrewMember } from "../../types/movie";
import { formatCurrency } from "../../utils/movieUtils";

interface MovieOverviewProps {
  movie: Movie;
  director?: CrewMember;
}

export default function MovieOverview({ movie, director }: MovieOverviewProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Overview</h2>
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
  );
}
