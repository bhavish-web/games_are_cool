"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Player, PlayerStats } from "@/types";

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  totalScore: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  bestScores: {},
  achievements: [],
  streaks: {},
};

export function usePlayer() {
  const [player, setPlayer] = useLocalStorage<Player | null>("gamevault_player", null);
  const [stats, setStats] = useLocalStorage<PlayerStats>("gamevault_stats", DEFAULT_STATS);
  const [showSetup, setShowSetup] = useState(false);

  const createPlayer = useCallback(
    (name: string) => {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: name.trim(),
        avatar: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${encodeURIComponent(name)}`,
        createdAt: Date.now(),
      };
      setPlayer(newPlayer);
      setShowSetup(false);
      return newPlayer;
    },
    [setPlayer]
  );

  const updateStats = useCallback(
    (gameId: string, score: number, result: "win" | "lose" | "draw") => {
      setStats((prev) => {
        const newBestScores = { ...prev.bestScores };
        const currentBest = newBestScores[gameId] ?? 0;
        if (score > currentBest) {
          newBestScores[gameId] = score;
        }

        return {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          totalScore: prev.totalScore + score,
          wins: result === "win" ? prev.wins + 1 : prev.wins,
          losses: result === "lose" ? prev.losses + 1 : prev.losses,
          draws: result === "draw" ? prev.draws + 1 : prev.draws,
          bestScores: newBestScores,
        };
      });
    },
    [setStats]
  );

  const addAchievement = useCallback(
    (achievementId: string) => {
      setStats((prev) => {
        if (prev.achievements.includes(achievementId)) return prev;
        return {
          ...prev,
          achievements: [...prev.achievements, achievementId],
        };
      });
    },
    [setStats]
  );

  return {
    player,
    stats,
    showSetup,
    setShowSetup,
    createPlayer,
    updateStats,
    addAchievement,
  };
}
