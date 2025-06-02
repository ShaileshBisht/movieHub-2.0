"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { VideoType } from "../types/movie";
import { Button } from "./ui/button";

interface VideoModalProps {
  video: VideoType | null;
  onClose: () => void;
  className?: string;
}

export default function VideoModal({ video, onClose, className = "" }: VideoModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (video) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [video, onClose]);

  if (!video) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 ${className}`} onClick={handleBackdropClick}>
      <div className="bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-white truncate">{video.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{video.type}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400 hover:text-white ml-4 flex-shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Video Content */}
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Published: {new Date(video.published_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-2">
              {video.official && <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Official</span>}
              <span>{video.site}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
