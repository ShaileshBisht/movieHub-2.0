import { Play } from "lucide-react";
import { VideoType } from "../../types/movie";
import { getYouTubeThumbnail } from "../../utils/movieUtils";

interface VideoCardProps {
  video: VideoType;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div className="flex-none w-80 cursor-pointer group" onClick={onClick}>
      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
        <img
          src={getYouTubeThumbnail(video.key)}
          alt={video.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-xs font-medium">{video.type}</span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">{video.name}</h3>
        <p className="text-gray-400 text-sm">{video.type}</p>
      </div>
    </div>
  );
}
