import type { Metadata } from "next";
import { LeaderboardView } from "@/components/shared/Leaderboard";

export const metadata: Metadata = {
  title: "Global Leaderboard",
  description: "See the top players and highest scores across all GameVault games.",
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <LeaderboardView />
    </div>
  );
}
