import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./api/tmdbApi";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PAUSE", "persist/PURGE", "persist/REGISTER"],
      },
    }).concat(tmdbApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
