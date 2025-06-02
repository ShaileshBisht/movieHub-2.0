"use client";

import { Loader2, Film } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  variant?: "default" | "minimal" | "branded";
  className?: string;
}

export default function LoadingSpinner({ size = "md", text = "Loading...", variant = "default", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-500`} />
      </div>
    );
  }

  if (variant === "branded") {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse">
            <Film className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="absolute -top-2 -right-2 w-6 h-6 animate-spin text-purple-400" />
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold mb-1">MovieHub</h3>
          <p className="text-gray-400 text-sm">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-500`} />
      {text && <p className={`text-gray-400 ${textSizeClasses[size]}`}>{text}</p>}
    </div>
  );
}

// Specialized loading components for common use cases
export function PageLoadingSpinner({ text = "Loading page..." }: { text?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <LoadingSpinner size="xl" text={text} variant="branded" />
    </div>
  );
}

export function SectionLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[20vh] space-y-4">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function InlineLoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="sm" variant="minimal" />
      {text && <span className="text-gray-400 text-sm">{text}</span>}
    </div>
  );
}
