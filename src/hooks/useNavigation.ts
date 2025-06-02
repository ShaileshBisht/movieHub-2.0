import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const navigateToCategory = (categoryId: string | null) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const navigateToGenre = (genreId: number | null) => {
    const params = new URLSearchParams();
    if (genreId) params.set("genre", genreId.toString());
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const navigateToSearch = (query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("search", query.trim());
      params.set("page", "1");
    }
    router.push(`/?${params.toString()}`);
  };

  const navigateToMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const navigateToWatchlist = () => {
    router.push("/watchlist");
  };

  const navigateToHome = () => {
    router.push("/");
  };

  const goBack = () => {
    router.back();
  };

  return {
    navigateToCategory,
    navigateToGenre,
    navigateToSearch,
    navigateToMovie,
    navigateToWatchlist,
    navigateToHome,
    goBack,
  };
};
