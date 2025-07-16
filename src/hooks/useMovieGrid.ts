import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetTrendingMoviesQuery,
  useGetMoviesByCategoryQuery,
  useGetMoviesByGenreQuery,
  useSearchMoviesQuery,
} from "../store/api/tmdbApi";

interface UseMovieGridProps {
  category: string | null;
  genre: number | null;
  search: string | null;
  currentPage: number;
}

export function useMovieGrid({ category, genre, search, currentPage }: UseMovieGridProps) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage || 1);

  // Determine which query to use
  const shouldSkipTrending = !!(category && category !== "trending") || !!genre || !!search;
  const shouldSkipCategory = !category || category === "trending" || !!genre || !!search;
  const shouldSkipGenre = !genre || !!search;
  const shouldSkipSearch = !search;

  // API Queries
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
  } = useGetTrendingMoviesQuery(
    { page },
    {
      skip: shouldSkipTrending,
    }
  );

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetMoviesByCategoryQuery(
    { category: category!, page },
    {
      skip: shouldSkipCategory,
    }
  );

  const {
    data: genreData,
    isLoading: genreLoading,
    error: genreError,
  } = useGetMoviesByGenreQuery(
    { genreId: genre!, page },
    {
      skip: shouldSkipGenre,
    }
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchMoviesQuery(
    { query: search!, page },
    {
      skip: shouldSkipSearch,
    }
  );

  // Get current data and loading state
  const currentData = search ? searchData : genre ? genreData : category && category !== "trending" ? categoryData : trendingData;
  const isLoading = search ? searchLoading : genre ? genreLoading : category && category !== "trending" ? categoryLoading : trendingLoading;
  const error = search ? searchError : genre ? genreError : category && category !== "trending" ? categoryError : trendingError;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, genre, search]);

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    // Update URL with new page
    const params = new URLSearchParams();
    if (category && category !== "trending") params.set("category", category);
    if (genre) params.set("genre", genre.toString());
    if (search) params.set("search", search);
    if (newPage > 1) params.set("page", newPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : "/";
    router.push(newUrl, { scroll: false });
  };

  // Get display title
  const getDisplayTitle = () => {
    if (search) return `Search Results for "${search}"`;
    if (genre) return "Movies by Genre";
    if (category) {
      switch (category) {
        case "trending":
          return "Trending Movies";
        case "popular":
          return "Popular Movies";
        case "top_rated":
          return "Top Rated Movies";
        case "now_playing":
          return "Now Playing";
        case "upcoming":
          return "Upcoming Movies";
        default:
          return "Movies";
      }
    }
    return "Trending Movies";
  };

  return {
    currentData,
    isLoading,
    error,
    page,
    handlePageChange,
    getDisplayTitle,
  };
}
