"use client";

import { useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoType } from "../types/movie";
import { getYouTubeThumbnail } from "../utils/movieUtils";

interface VideoCarouselProps {
  videos: VideoType[];
  onVideoSelect: (video: VideoType) => void;
  title?: string;
  className?: string;
}

export default function VideoCarousel({ videos, onVideoSelect, title = "Videos", className = "" }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one video card plus gap
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (!videos.length) {
    return null;
  }

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onClick={() => onVideoSelect(video)} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface VideoCardProps {
  video: VideoType;
  onClick: () => void;
}

function VideoCard({ video, onClick }: VideoCardProps) {
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
