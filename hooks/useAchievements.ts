"use client";

import { useCallback } from "react";
import { Achievement, PlayerStats } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_game",
    title: "First Steps",
    description: "Play your first game",
    icon: "🎮",
    condition: (stats) => stats.gamesPlayed >= 1,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Get under 200ms reaction time",
    icon: "⚡",
    condition: (stats) => (stats.bestScores["reaction-time"] ?? 9999) < 200,
  },
  {
    id: "snake_master",
    title: "Snake Master",
    description: "Score 500+ in Snake",
    icon: "🐍",
    condition: (stats) => (stats.bestScores["snake"] ?? 0) >= 500,
  },
  {
    id: "memory_king",
    title: "Memory King",
    description: "Complete Memory Match in under 30 seconds",
    icon: "🧠",
    condition: (stats) => (stats.bestScores["memory-match"] ?? 0) >= 1000,
  },
  {
    id: "undefeated",
    title: "Undefeated",
    description: "Win 10 games",
    icon: "🏆",
    condition: (stats) => stats.wins >= 10,
  },
  {
    id: "veteran",
    title: "Veteran",
    description: "Play 50 games",
    icon: "🎖️",
    condition: (stats) => stats.gamesPlayed >= 50,
  },
  {
    id: "high_scorer",
    title: "High Scorer",
    description: "Accumulate 10,000 total score",
    icon: "💎",
    condition: (stats) => stats.totalScore >= 10000,
  },
  {
    id: "ttt_genius",
    title: "Tic-Tac-Genius",
    description: "Beat AI on Hard difficulty",
    icon: "🤖",
    condition: (stats) => (stats.bestScores["tic-tac-toe-hard"] ?? 0) > 0,
  },
];

export function useAchievements() {
  const checkAchievements = useCallback(
    (stats: PlayerStats): Achievement[] => {
      return ACHIEVEMENTS.filter(
        (achievement) =>
          !stats.achievements.includes(achievement.id) &&
          achievement.condition(stats)
      );
    },
    []
  );

  const getUnlockedAchievements = useCallback(
    (stats: PlayerStats): Achievement[] => {
      return ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id));
    },
    []
  );

  return {
    achievements: ACHIEVEMENTS,
    checkAchievements,
    getUnlockedAchievements,
  };
}
