"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Star, Gamepad2, Calendar, RefreshCw } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePlayer } from "@/hooks/usePlayer";
import { useAchievements } from "@/hooks/useAchievements";
import { GAMES, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const RANK_STYLES = [
  { icon: Crown, class: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  { icon: Medal, class: "text-slate-300 bg-slate-500/10 border-slate-500/30" },
  { icon: Medal, class: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
];

export function LeaderboardView() {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const { scores, getGameScores, getTopScores, clearLeaderboard } = useLeaderboard();
  const { player, stats } = usePlayer();
  const { getUnlockedAchievements } = useAchievements();

  const displayScores =
    selectedGame === "all"
      ? getTopScores(20)
      : getGameScores(selectedGame as any).slice(0, 20);

  const unlockedAchievements = player && stats ? getUnlockedAchievements(stats) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">
          Hall of Fame
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black font-display gradient-text mb-4">
              Global Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Compete with players worldwide and claim your spot at the top.
            </p>
          </div>
          {scores.length > 0 && (
            <button
              onClick={clearLeaderboard}
              className="btn-ghost text-xs text-red-400 hover:text-red-300 mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Clear
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            <button
              onClick={() => setSelectedGame("all")}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                selectedGame === "all"
                  ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
              )}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              All Games
            </button>
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  selectedGame === game.id
                    ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                )}
              >
                {game.icon} {game.title}
              </button>
            ))}
          </motion.div>

          {/* Scores List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            {displayScores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="text-lg font-bold mb-2">No scores yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start playing to appear on the leaderboard!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {displayScores.map((score, index) => {
                  const rankStyle = RANK_STYLES[index];
                  const RankIcon = rankStyle?.icon ?? Star;
                  const isCurrentPlayer = player?.id === score.playerId;
                  const game = GAMES.find((g) => g.id === score.gameId);

                  return (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "flex items-center gap-4 p-4 transition-all duration-200",
                        isCurrentPlayer
                          ? "bg-purple-500/10 hover:bg-purple-500/15"
                          : "hover:bg-white/3"
                      )}
                    >
                      {/* Rank */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 border",
                          rankStyle
                            ? rankStyle.class
                            : "bg-white/5 border-white/10 text-muted-foreground"
                        )}
                      >
                        {index < 3 ? (
                          <RankIcon className="w-4 h-4" />
                        ) : (
                          <span>#{index + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 
                                   flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      >
                        {score.playerName[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">
                            {score.playerName}
                          </span>
                          {isCurrentPlayer && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full 
                                             bg-purple-500/20 text-purple-300 border border-purple-500/20">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {game && (
                            <span className="text-xs text-muted-foreground">
                              {game.icon} {game.title}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score & Time */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black font-display text-purple-300">
                          {score.score.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 justify-end text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatRelativeTime(score.createdAt)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Player Stats */}
          {player && stats && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Your Stats
              </h3>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 
                               flex items-center justify-center text-lg font-black text-white">
                  {player.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{player.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.achievements.length} achievements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Games", value: stats.gamesPlayed, color: "text-blue-400" },
                  { label: "Wins", value: stats.wins, color: "text-green-400" },
                  { label: "Score", value: stats.totalScore, color: "text-purple-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <p className={`text-xl font-black font-display ${stat.color}`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Win Rate Bar */}
              {stats.gamesPlayed > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">
                      {Math.round((stats.wins / stats.gamesPlayed) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round((stats.wins / stats.gamesPlayed) * 100)}%`,
                      }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Achievements */}
          {player && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                Achievements ({unlockedAchievements.length}/8)
              </h3>

              <div className="space-y-2">
                {unlockedAchievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Play games to unlock achievements!
                  </p>
                ) : (
                  unlockedAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-3 rounded-xl 
                                 bg-yellow-500/5 border border-yellow-500/10"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Locked Achievements Preview */}
                {unlockedAchievements.length < 8 && stats && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Locked:</p>
                    {[...Array(Math.min(3, 8 - unlockedAchievements.length))].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl 
                                   bg-white/3 border border-white/5 opacity-50"
                      >
                        <span className="text-2xl grayscale">🔒</span>
                        <div>
                          <p className="text-sm text-muted-foreground">???</p>
                          <p className="text-xs text-muted-foreground">Keep playing to unlock</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
