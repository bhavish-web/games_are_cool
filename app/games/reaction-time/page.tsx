import type { Metadata } from "next";
import { ReactionTimeGame } from "@/components/games/ReactionTime";

export const metadata: Metadata = {
  title: "Reaction Time",
  description: "Test how fast your reflexes are! Click when the screen changes color.",
};

export default function ReactionTimePage() {
  return <ReactionTimeGame />;
}
