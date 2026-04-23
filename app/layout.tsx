import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GameVault — Premium Browser Gaming Platform",
    template: "%s | GameVault",
  },
  description:
    "Play premium browser games with friends. Tic Tac Toe, Snake, Memory Match, Rock Paper Scissors and more. Track your scores on global leaderboards.",
  keywords: [
    "browser games",
    "online games",
    "tic tac toe",
    "snake game",
    "memory match",
    "leaderboard",
    "free games",
  ],
  authors: [{ name: "GameVault Team" }],
  creator: "GameVault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamevault.app",
    title: "GameVault — Premium Browser Gaming Platform",
    description: "Play premium browser games and compete on global leaderboards.",
    siteName: "GameVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameVault — Premium Browser Gaming Platform",
    description: "Play premium browser games and compete on global leaderboards.",
    creator: "@gamevault",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
