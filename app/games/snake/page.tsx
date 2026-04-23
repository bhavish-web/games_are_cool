import type { Metadata } from "next";
import { SnakeGame } from "@/components/games/SnakeGame";

export const metadata: Metadata = {
  title: "Snake Game",
  description: "Classic snake game with increasing speed and difficulty levels.",
};

export default function SnakePage() {
  return <SnakeGame />;
}
