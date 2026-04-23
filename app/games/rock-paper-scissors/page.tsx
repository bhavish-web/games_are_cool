import type { Metadata } from "next";
import { RPSGame } from "@/components/games/RockPaperScissors";

export const metadata: Metadata = {
  title: "Rock Paper Scissors",
  description: "Battle the AI in Rock Paper Scissors and track your win streak!",
};

export default function RPSPage() {
  return <RPSGame />;
}
