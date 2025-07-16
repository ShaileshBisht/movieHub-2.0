"use client";

import { Suspense } from "react";
import MovieGrid from "../components/MovieGrid";
import MainLayout from "../components/layout/MainLayout";
import { useHomePage } from "./hooks";

function HomePageContent() {
  const { category, genre, search, currentPage } = useHomePage();

  return (
    <MainLayout category={category} genre={genre}>
      <MovieGrid category={category} genre={genre} search={search} currentPage={currentPage} />
    </MainLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
