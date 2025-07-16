"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoType } from "../types/movie";
import VideoCard from "./ui/VideoCard";

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
      <VideoCarouselHeader title={title} onScrollLeft={() => scroll("left")} onScrollRight={() => scroll("right")} />

      {/* Video Carousel */}
      <VideoCarouselContent videos={videos} onVideoSelect={onVideoSelect} scrollRef={scrollRef} />
    </div>
  );
}

interface VideoCarouselHeaderProps {
  title: string;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

function VideoCarouselHeader({ title, onScrollLeft, onScrollRight }: VideoCarouselHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex gap-2">
        <button
          onClick={onScrollLeft}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onScrollRight}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface VideoCarouselContentProps {
  videos: VideoType[];
  onVideoSelect: (video: VideoType) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function VideoCarouselContent({ videos, onVideoSelect, scrollRef }: VideoCarouselContentProps) {
  return (
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
  );
}
