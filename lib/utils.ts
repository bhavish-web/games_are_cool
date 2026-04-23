import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GameConfig } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
  if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
  return score.toString();
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const GAMES: GameConfig[] = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Challenge our AI in the classic battle of Xs and Os. Can you outsmart the machine?",
    icon: "✕○",
    color: "from-violet-500 to-purple-600",
    gradient: "from-violet-500/20 via-purple-600/20 to-indigo-600/20",
    tags: ["Strategy", "AI", "Classic"],
    href: "/games/tic-tac-toe",
    highScoreKey: "tic-tac-toe",
    isHigherBetter: true,
  },
  {
    id: "snake",
    title: "Snake",
    description: "Grow your snake, dodge walls, and beat your high score in this timeless arcade classic.",
    icon: "🐍",
    color: "from-emerald-500 to-green-600",
    gradient: "from-emerald-500/20 via-green-600/20 to-teal-600/20",
    tags: ["Arcade", "Speed", "Classic"],
    href: "/games/snake",
    highScoreKey: "snake",
    isHigherBetter: true,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Test your memory with emoji pairs. Race against the clock and minimize your moves.",
    icon: "🧠",
    color: "from-blue-500 to-cyan-600",
    gradient: "from-blue-500/20 via-cyan-600/20 to-sky-600/20",
    tags: ["Memory", "Puzzle", "Timed"],
    href: "/games/memory-match",
    highScoreKey: "memory-match",
    isHigherBetter: true,
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Battle the AI in this game of chance and strategy. Track your win streak!",
    icon: "🎯",
    color: "from-orange-500 to-red-600",
    gradient: "from-orange-500/20 via-red-600/20 to-rose-600/20",
    tags: ["Strategy", "AI", "Quick"],
    href: "/games/rock-paper-scissors",
    highScoreKey: "rock-paper-scissors",
    isHigherBetter: true,
  },
  {
    id: "reaction-time",
    title: "Reaction Time",
    description: "How fast are your reflexes? Test your reaction time and compete globally.",
    icon: "⚡",
    color: "from-yellow-500 to-amber-600",
    gradient: "from-yellow-500/20 via-amber-600/20 to-orange-600/20",
    tags: ["Reflex", "Speed", "Skill"],
    href: "/games/reaction-time",
    highScoreKey: "reaction-time",
    isHigherBetter: false,
  },
];
