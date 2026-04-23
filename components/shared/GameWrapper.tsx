"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { PlayerSetup } from "./PlayerSetup";
import { ScoreDisplay } from "./ScoreDisplay";
import { AchievementToast } from "./AchievementToast";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAchievements } from "@/hooks/useAchievements";
import { GameId } from "@/types";
import { cn } from "@/lib/utils";

interface GameWrapperProps {
  gameId: GameId;
  gameName: string;
  gameColor: string;
  children: React.ReactNode;
  currentScore?: number;
  onReset?: () => void;
  showScoreInHeader?: boolean;
}

export function GameWrapper({
  gameId,
  gameName,
  gameColor,
  children,
  currentScore = 0,
  onReset,
  showScoreInHeader = true,
}: GameWrapperProps) {
  const { player, stats, createPlayer } = usePlayer();
  const { getGameScores, getPlayerBest } = useLeaderboard();
  const { checkAchievements } = useAchievements();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (player && stats) {
      const unlocked = checkAchievements(stats);
      if (unlocked.length > 0) {
        setNewAchievements(unlocked.map((a) => a.id));
        setTimeout(() => setNewAchievements([]), 5000);
      }
    }
  }, [stats, player, checkAchievements]);

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold font-display gradient-text mb-2">
              {gameName}
            </h1>
            <p className="text-muted-foreground">
              Set up your player profile to start playing
            </p>
          </motion.div>
          <AnimatePresence>
            <PlayerSetup onComplete={createPlayer} />
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const gameScores = getGameScores(gameId);
  const playerBest = getPlayerBest(player.id, gameId);

  return (
    <div className="min-h-screen pt-20">
      {/* Achievement Toasts */}
      <AchievementToast achievementIds={newAchievements} />

      {/* Game Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/games"
              className="flex items-center gap-2 text-sm text-muted-foreground 
                         hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:block">Back to Games</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <h1 className="text-xl font-bold font-display gradient-text">{gameName}</h1>
              <p className="text-xs text-muted-foreground">
                Playing as{" "}
                <span className="text-foreground font-medium">{player.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showScoreInHeader && (
              <div className="score-badge">
                <Trophy className="w-3.5 h-3.5" />
                <span>Best: {playerBest?.score ?? 0}</span>
              </div>
            )}
            {onReset && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="btn-ghost text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </motion.button>
            )}
          </div>
        </div>

        {/* Game Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>

        {/* Mini Leaderboard */}
        {gameScores.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Top Scores — {gameName}
              </h3>
              <Link
                href="/leaderboard"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-2">
              {gameScores.slice(0, 5).map((score, index) => (
                <div
                  key={score.id}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 rounded-lg transition-all",
                    score.playerId === player.id
                      ? "bg-purple-500/10 border border-purple-500/20"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index === 0 && "bg-yellow-500/20 text-yellow-400",
                        index === 1 && "bg-gray-400/20 text-gray-400",
                        index === 2 && "bg-orange-500/20 text-orange-400",
                        index > 2 && "bg-white/10 text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {score.playerName}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    {score.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
