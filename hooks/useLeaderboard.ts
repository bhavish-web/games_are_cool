"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { GameScore } from "@/types";

const MAX_ENTRIES_PER_GAME = 10;

export function useLeaderboard() {
  const [scores, setScores] = useLocalStorage<GameScore[]>("gamevault_leaderboard", []);

  const addScore = useCallback(
    (entry: Omit<GameScore, "id" | "createdAt">) => {
      const newScore: GameScore = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      setScores((prev) => {
        const gameScores = prev.filter((s) => s.gameId === entry.gameId);
        const otherScores = prev.filter((s) => s.gameId !== entry.gameId);

        // Keep top scores per game
        const updatedGameScores = [...gameScores, newScore]
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_ENTRIES_PER_GAME);

        return [...otherScores, ...updatedGameScores];
      });

      return newScore;
    },
    [setScores]
  );

  const getGameScores = useCallback(
    (gameId: string) => {
      return scores
        .filter((s) => s.gameId === gameId)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES_PER_GAME);
    },
    [scores]
  );

  const getTopScores = useCallback(
    (limit = 10) => {
      return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    },
    [scores]
  );

  const getPlayerBest = useCallback(
    (playerId: string, gameId: string) => {
      return scores
        .filter((s) => s.playerId === playerId && s.gameId === gameId)
        .sort((a, b) => b.score - a.score)[0] ?? null;
    },
    [scores]
  );

  const clearLeaderboard = useCallback(() => {
    setScores([]);
  }, [setScores]);

  return {
    scores,
    addScore,
    getGameScores,
    getTopScores,
    getPlayerBest,
    clearLeaderboard,
  };
}
