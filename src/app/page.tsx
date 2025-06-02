"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import Sidebar from "@/components/ui/sidebar";
import { getWatchlistCount } from "@/utils/watchlist";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set("search", searchQuery.trim());
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />
      <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}

function WatchlistButton() {
  const router = useRouter();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    // Update count on mount
    setWatchlistCount(getWatchlistCount());

    // Listen for watchlist updates
    const handleWatchlistUpdate = () => {
      setWatchlistCount(getWatchlistCount());
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
  }, []);

  const handleWatchlistClick = () => {
    router.push("/watchlist");
  };

  return (
    <Button
      onClick={handleWatchlistClick}
      variant="outline"
      className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20 hover:border-pink-400 relative"
    >
      <Heart className="w-4 h-4 mr-2" />
      Watchlist
      {watchlistCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {watchlistCount > 99 ? "99+" : watchlistCount}
        </span>
      )}
    </Button>
  );
}

function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const genre = searchParams.get("genre") ? parseInt(searchParams.get("genre")!) : null;
  const search = searchParams.get("search");
  const currentPage = parseInt(searchParams.get("page") || "1");

  const handleCategorySelect = (categoryId: string | null) => {
    const params = new URLSearchParams();
    if (categoryId) {
      params.set("category", categoryId);
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handleGenreSelect = (genreId: number | null) => {
    const params = new URLSearchParams();
    if (genreId) {
      params.set("genre", genreId.toString());
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <Sidebar
        onCategorySelect={handleCategorySelect}
        onGenreSelect={handleGenreSelect}
        selectedCategory={!genre && !search ? category : null}
        selectedGenre={genre}
        onToggle={() => {}}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/20 flex-shrink-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MovieHub</h1>
              <div className="flex items-center gap-4">
                <SearchBar />
                <WatchlistButton />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <MovieGrid category={category} genre={genre} search={search} currentPage={currentPage} />
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
