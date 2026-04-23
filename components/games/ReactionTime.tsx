"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Timer, Trophy, TrendingDown } from "lucide-react";
import { GameWrapper } from "@/components/shared/GameWrapper";
import { Confetti } from "@/components/shared/Confetti";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";

type GameState = "waiting" | "ready" | "click" | "result" | "toosoon";

const ROUNDS = 5;
const MIN_DELAY = 1500;
const MAX_DELAY = 4500;

function getRating(ms: number): { label: string; color: string; emoji: string } {
  if (ms < 150) return { label: "Superhuman!", color: "text-purple-400", emoji: "🚀" };
  if (ms < 200) return { label: "Lightning Fast", color: "text-blue-400", emoji: "⚡" };
  if (ms < 250) return { label: "Excellent", color: "text-green-400", emoji: "🌟" };
  if (ms < 350) return { label: "Good", color: "text-yellow-400", emoji: "👍" };
  if (ms < 500) return { label: "Average", color: "text-orange-400", emoji: "😐" };
  return { label: "Keep Practicing", color: "text-red-400", emoji: "🐌" };
}

export function ReactionTimeGame() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const countdownRef = useRef<ReturnType<typeof setInterval>>();

  const { player, updateStats } = usePlayer();
  const { addScore } = useLeaderboard();
  const { playSound } = useSound();

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  const startRound = useCallback(() => {
    setGameState("ready");
    setReactionTime(null);
    setCountdown(3);

    clearTimeout(timeoutRef.current);

    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    timeoutRef.current = setTimeout(() => {
      playSound("tick");
      setGameState("click");
      startTimeRef.current = performance.now();
    }, delay);
  }, [playSound]);

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      startRound();
      return;
    }

    if (gameState === "ready") {
      clearTimeout(timeoutRef.current);
      setGameState("toosoon");
      playSound("error");
      return;
    }

    if (gameState === "click") {
      const reaction = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(reaction);
      setGameState("result");
      playSound("win");

      const newResults = [...results, reaction];
      setResults(newResults);

      const avg = Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length);
      const isNewBest = bestTime === null || reaction < bestTime;

      if (isNewBest) {
        setBestTime(reaction);
        if (reaction < 200) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }

      if (newResults.length >= ROUNDS) {
        const score = Math.max(0, Math.round(10000 / avg));
        if (player) {
          addScore({
            playerId: player.id,
            playerName: player.name,
            gameId: "reaction-time",
            gameName: "Reaction Time",
            score,
            metadata: { averageMs: avg, bestMs: Math.min(...newResults) },
          });
          updateStats("reaction-time", score, avg < 300 ? "win" : "lose");
          // Store best time in a special key (lower is better)
          updateStats("reaction-time-best", reaction, "win");
        }
      }
    }
  }, [gameState, results, bestTime, player, addScore, updateStats, playSound, startRound]);

  const reset = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setGameState("waiting");
    setReactionTime(null);
    setResults([]);
    setShowConfetti(false);
  }, []);

  const avg = results.length > 0
    ? Math.round(results.reduce((a, b) => a + b, 0) / results.length)
    : null;

  const isComplete = results.length >= ROUNDS;
  const finalScore = avg ? Math.max(0, Math.round(10000 / avg)) : 0;

  const getStateConfig = () => {
    switch (gameState) {
      case "waiting":
        return {
          bg: "from-slate-800 to-slate-900",
          border: "border-white/10",
          title: "Click to Start",
          subtitle: "Test your reaction time",
          icon: "🎯",
        };
      case "ready":
        return {
          bg: "from-red-900/50 to-orange-900/50",
          border: "border-red-500/30",
          title: "Wait for it...",
          subtitle: "Don't click yet!",
          icon: "⏳",
        };
      case "click":
        return {
          bg: "from-green-800/70 to-emerald-900/70",
          border: "border-green-400/50",
          title: "CLICK NOW!",
          subtitle: "",
          icon: "⚡",
        };
      case "result":
        return {
          bg: "from-purple-900/50 to-blue-900/50",
          border: "border-purple-500/30",
          title: `${reactionTime}ms`,
          subtitle: getRating(reactionTime!).label,
          icon: getRating(reactionTime!).emoji,
        };
      case "toosoon":
        return {
          bg: "from-red-900/60 to-rose-900/60",
          border: "border-red-500/40",
          title: "Too Soon!",
          subtitle: "Wait for green before clicking",
          icon: "❌",
        };
    }
  };

  const config = getStateConfig();

  return (
    <GameWrapper
      gameId="reaction-time"
      gameName="Reaction Time"
      gameColor="from-yellow-500 to-amber-600"
      currentScore={finalScore}
      onReset={reset}
    >
      <Confetti trigger={showConfetti} type="fireworks" />

      <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
        {/* Round Progress */}
        <div className="w-full flex items-center gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <motion.div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < results.length
                  ? results[i] < 250
                    ? "bg-green-400"
                    : results[i] < 400
                    ? "bg-yellow-400"
                    : "bg-red-400"
                  : i === results.length
                  ? "bg-white/30 animate-pulse"
                  : "bg-white/10"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
            {results.length}/{ROUNDS}
          </span>
        </div>

        {/* Stats Row */}
        {results.length > 0 && (
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Avg: <span className="font-bold text-blue-300">{avg}ms</span></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Best: <span className="font-bold text-yellow-300">{bestTime}ms</span></span>
            </div>
            {avg && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <TrendingDown className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">
                  Score: <span className="font-bold text-purple-300">{Math.max(0, Math.round(10000 / avg))}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Main Click Area */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.button
              key={gameState}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              whileHover={gameState !== "click" ? { scale: 1.01 } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
              className={`w-full aspect-[2/1] rounded-3xl border-2 transition-all duration-200
                           flex flex-col items-center justify-center gap-4 cursor-pointer
                           bg-gradient-to-br ${config.bg} ${config.border}
                           shadow-2xl select-none`}
            >
              <motion.div
                animate={gameState === "click" ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.3, repeat: gameState === "click" ? Infinity : 0 }}
                className="text-6xl"
              >
                {config.icon}
              </motion.div>
              <div className="text-center">
                <motion.h2
                  className={`text-3xl sm:text-4xl font-black font-display ${
                    gameState === "click" ? "text-green-300 animate-pulse" : "text-foreground"
                  }`}
                >
                  {config.title}
                </motion.h2>
                {config.subtitle && (
                  <p className="text-muted-foreground mt-1">{config.subtitle}</p>
                )}
              </div>
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full glass-card p-8 text-center"
            >
              <div className="text-5xl mb-4">
                {getRating(avg!).emoji}
              </div>
              <h3 className="text-2xl font-black font-display gradient-text mb-1">
                {isComplete ? "Session Complete!" : ""}
              </h3>
              <p className={`text-lg font-semibold mb-6 ${getRating(avg!).color}`}>
                {getRating(avg!).label}
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Average</p>
                  <p className="text-xl font-black font-display">{avg}ms</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Best</p>
                  <p className="text-xl font-black font-display text-yellow-300">{bestTime}ms</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Score</p>
                  <p className="text-xl font-black font-display text-purple-300">{finalScore}</p>
                </div>
              </div>

              {/* Individual times */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {results.map((t, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      t === Math.min(...results)
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {t}ms
                  </div>
                ))}
              </div>

              <button onClick={reset} className="btn-primary w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        {(gameState === "result" || gameState === "toosoon") && !isComplete && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRound}
            className="btn-primary"
          >
            <Zap className="w-4 h-4 mr-2" />
            Next Round ({results.length + 1}/{ROUNDS})
          </motion.button>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Click when the screen turns green • {ROUNDS} rounds per session
        </p>
      </div>
    </GameWrapper>
  );
}
