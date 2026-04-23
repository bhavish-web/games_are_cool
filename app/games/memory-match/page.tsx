import type { Metadata } from "next";
import { MemoryMatchGame } from "@/components/games/MemoryMatch";

export const metadata: Metadata = {
  title: "Memory Match",
  description: "Test your memory with emoji pairs. Race against the clock!",
};

export default function MemoryMatchPage() {
  return <MemoryMatchGame />;
}
