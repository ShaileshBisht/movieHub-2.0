import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../components/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "MovieHub - Discover Amazing Movies",
  description: "Your ultimate destination for discovering, exploring, and tracking movies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background font-sans antialiased m-0 p-0">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
