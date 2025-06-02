import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Movie", "Movies", "TrendingMovies"],
  endpoints: (builder) => ({
    // Get trending movies
    getTrendingMovies: builder.query({
      query: ({ page = 1 } = {}) => `/trending/movie/week?api_key=${API_KEY}&language=en-US&page=${page}`,
      providesTags: ["TrendingMovies"],
      keepUnusedDataFor: 30, // Keep data for only 30 seconds
    }),

    // Get movies by category (unified endpoint)
    getMoviesByCategory: builder.query({
      query: ({ category, page = 1 }) => {
        const endpoints = {
          popular: `/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
          top_rated: `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
          now_playing: `/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
          upcoming: `/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`,
        };
        return endpoints[category] || endpoints.popular;
      },
      providesTags: ["Movies"],
    }),

    // Get movies by genre
    getMoviesByGenre: builder.query({
      query: ({ genreId, page = 1 }) =>
        `/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
      providesTags: ["Movies"],
    }),

    // Get popular movies
    getPopularMovies: builder.query({
      query: (page = 1) => `/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
      providesTags: ["Movies"],
    }),

    // Get top rated movies
    getTopRatedMovies: builder.query({
      query: (page = 1) => `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`,
      providesTags: ["Movies"],
    }),

    // Get now playing movies
    getNowPlayingMovies: builder.query({
      query: (page = 1) => `/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
      providesTags: ["Movies"],
    }),

    // Get upcoming movies
    getUpcomingMovies: builder.query({
      query: (page = 1) => `/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`,
      providesTags: ["Movies"],
    }),

    // Search movies
    searchMovies: builder.query({
      query: ({ query, page = 1 }) => `/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
      providesTags: ["Movies"],
    }),

    // Get movie details
    getMovieDetails: builder.query({
      query: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
      providesTags: (result, error, movieId) => [{ type: "Movie", id: movieId }],
    }),

    // Get movie credits
    getMovieCredits: builder.query({
      query: (movieId) => `/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
      providesTags: (result, error, movieId) => [{ type: "Movie", id: movieId }],
    }),

    // Get movie videos
    getMovieVideos: builder.query({
      query: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`,
      providesTags: (result, error, movieId) => [{ type: "Movie", id: movieId }],
    }),

    // Get similar movies
    getSimilarMovies: builder.query({
      query: (movieId) => `/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`,
      providesTags: (result, error, movieId) => [{ type: "Movie", id: movieId }],
    }),

    // Get movie genres
    getMovieGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      providesTags: ["Movies"],
    }),

    // Discover movies with filters
    discoverMovies: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams({
          api_key: API_KEY,
          language: "en-US",
          page: params.page || 1,
          sort_by: params.sortBy || "popularity.desc",
          ...params,
        });
        return `/discover/movie?${queryParams}`;
      },
      providesTags: ["Movies"],
    }),
  }),
});

export const {
  useGetTrendingMoviesQuery,
  useGetMoviesByCategoryQuery,
  useGetMoviesByGenreQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetUpcomingMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetSimilarMoviesQuery,
  useGetMovieGenresQuery,
  useDiscoverMoviesQuery,
  useLazySearchMoviesQuery,
} = tmdbApi;
