"use client";

import { CastMember } from "../types/movie";
import { getImageUrl } from "../utils/movieUtils";

interface CastGridProps {
  cast: CastMember[];
  title?: string;
  maxItems?: number;
  className?: string;
}

export default function CastGrid({ cast, title = "Cast", maxItems = 12, className = "" }: CastGridProps) {
  if (!cast.length) {
    return null;
  }

  const displayCast = cast.slice(0, maxItems);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 text-sm">
          Showing {displayCast.length} of {cast.length} cast members
        </p>
      </div>

      {/* Cast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayCast.map((person) => (
          <CastCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}

interface CastCardProps {
  person: CastMember;
}

function CastCard({ person }: CastCardProps) {
  return (
    <div className="group text-center">
      <div className="aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gray-800 relative">
        <img
          src={getImageUrl(person.profile_path, "w185")}
          alt={person.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <p className="text-white text-xs font-medium truncate">{person.character}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-white truncate group-hover:text-purple-400 transition-colors">{person.name}</h3>
        <p className="text-gray-400 text-xs truncate">{person.character}</p>
      </div>
    </div>
  );
}
