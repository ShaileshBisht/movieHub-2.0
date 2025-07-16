import { useSearchParams } from "next/navigation";

export function useHomePage() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const genre = searchParams.get("genre") ? parseInt(searchParams.get("genre")!) : null;
  const search = searchParams.get("search");
  const currentPage = parseInt(searchParams.get("page") || "1");

  return {
    category,
    genre,
    search,
    currentPage,
  };
}
