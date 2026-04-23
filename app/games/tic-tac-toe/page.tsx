import type { Metadata } from "next";
import { TicTacToeGame } from "@/components/games/TicTacToe";

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Challenge our AI in the classic game of Tic Tac Toe with multiple difficulty levels.",
};

export default function TicTacToePage() {
  return <TicTacToeGame />;
}
