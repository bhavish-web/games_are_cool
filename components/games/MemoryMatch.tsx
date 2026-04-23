"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Target, RotateCcw, Trophy } from "lucide-react";
import { GameWrapper } from "@/components/shared/GameWrapper";
import { Confetti } from "@/components/shared/Confetti";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { MemoryCard } from "@/types";

const EMOJI_SETS = {
  easy: ["🎮", "🏆", "⚡", "🎯", "🚀", "💎"],
  medium: ["🎮", "🏆", "⚡", "🎯", "🚀", "💎", "🌟", "🎨"],
  hard: ["🎮", "🏆", "⚡", "🎯", "🚀", "💎", "🌟", "🎨", "🔥", "🎭"],
};

type Difficulty = "easy" | "medium" | "hard";

function createCards(emojis: string[]): MemoryCard[] {
  return [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
}

function calculateScore(timeMs: number, moves: number, matches: number): number {
  const timeBonus = Math.max(0, 30000 - timeMs) / 30;
  const moveBonus = Math.max(0, 100 - moves * 2);
  const matchBonus = matches * 100;
  return Math.floor(timeBonus + moveBonus + matchBonus);
}

export function MemoryMatchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<MemoryCard[]>(() => createCards(EMOJI_SETS.easy));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
  const [isChecking, setIsChecking] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const { player, updateStats } = usePlayer();
  const { addScore } = useLeaderboard();
  const { playSound } = useSound();

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setTimeMs((prev) => prev + 100), 100);
    return () => clearInterval(interval);
  }, [gameState]);

  const initGame = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setCards(createCards(EMOJI_SETS[d]));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTimeMs(0);
    setGameState("idle");
    setIsChecking(false);
    setFinalScore(0);
    setShowConfetti(false);
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || gameState === "won") return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;

      if (gameState === "idle") setGameState("playing");

      playSound("click");

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setMoves((prev) => prev + 1);

        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId)!;
        const secondCard = cards.find((c) => c.id === secondId)!;

        if (firstCard.emoji === secondCard.emoji) {
          playSound("match");
          const newMatches = matches + 1;
          setMatches(newMatches);

          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setIsChecking(false);

          const totalPairs = EMOJI_SETS[difficulty].length;
          if (newMatches === totalPairs) {
            setTimeout(() => {
              const score = calculateScore(timeMs, moves + 1, newMatches);
              setFinalScore(score);
              setGameState("won");
              setShowConfetti(true);
              playSound("win");

              if (player) {
                addScore({
                  playerId: player.id,
                  playerName: player.name,
                  gameId: "memory-match",
                  gameName: "Memory Match",
                  score,
                  metadata: { difficulty, moves: moves + 1, timeMs },
                });
                updateStats("memory-match", score, "win");
              }
            }, 300);
          }
        } else {
          playSound("error");
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, isChecking, gameState, matches, difficulty, timeMs, moves, player, addScore, updateStats, playSound]
  );

  const totalPairs = EMOJI_SETS[difficulty].length;
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const gridCols = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;

  return (
    <GameWrapper
      gameId="memory-match"
      gameName="Memory Match"
      gameColor="from-blue-500 to-cyan-600"
      currentScore={finalScore}
      onReset={() => initGame(difficulty)}
    >
      <Confetti trigger={showConfetti} type="winner" />

      <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
        {/* Difficulty */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => initGame(d)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                difficulty === d
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-lg font-bold font-display tabular-nums">
              {formatTime(timeMs)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-lg font-bold font-display">{moves} moves</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-lg font-bold font-display">
              {matches}/{totalPairs} pairs
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="memory-card"
              style={{ perspective: "1000px" }}
            >
              <motion.button
                onClick={() => handleCardClick(card.id)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl cursor-pointer
                             transition-all duration-300 ${
                               card.isMatched
                                 ? "cursor-default"
                                 : "hover:scale-105 active:scale-95"
                             }`}
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                disabled={card.isMatched || isChecking}
              >
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center
                              bg-gradient-to-br from-blue-600/30 to-cyan-600/30 
                              border-2 border-blue-500/30"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-blue-400/50 text-2xl select-none">?</span>
                </div>

                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-xl flex items-center justify-center
                               border-2 transition-all duration-300
                               ${card.isMatched
                                 ? "bg-green-500/20 border-green-500/40 shadow-lg shadow-green-500/20"
                                 : "bg-white/10 border-white/20"
                               }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="text-3xl select-none">{card.emoji}</span>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Win State */}
        <AnimatePresence>
          {gameState === "won" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm glass-card p-8 text-center"
            >
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-black font-display gradient-text mb-2">
                Puzzle Complete!
              </h3>
              <div className="grid grid-cols-3 gap-3 my-6 text-sm">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-muted-foreground mb-1">Time</p>
                  <p className="font-bold">{formatTime(timeMs)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-muted-foreground mb-1">Moves</p>
                  <p className="font-bold">{moves}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                  <p className="text-muted-foreground mb-1">Score</p>
                  <p className="font-bold text-purple-300">{finalScore}</p>
                </div>
              </div>
              <button
                onClick={() => initGame(difficulty)}
                className="btn-primary w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === "idle" && (
          <p className="text-sm text-muted-foreground">
            Click any card to start the timer
          </p>
        )}
      </div>
    </GameWrapper>
  );
}
