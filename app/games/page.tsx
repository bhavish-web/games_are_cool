import type { Metadata } from "next";
import { GamesGrid } from "@/components/games/GamesGrid";

export const metadata: Metadata = {
  title: "Games Dashboard",
  description: "Browse all premium browser games in the GameVault collection.",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <GamesGrid />
    </div>
  );
}
