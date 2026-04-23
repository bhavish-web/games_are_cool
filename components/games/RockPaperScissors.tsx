"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Zap, Trophy, Target, Flame } from "lucide-react";
import { GameWrapper } from "@/components/shared/GameWrapper";
import { Confetti } from "@/components/shared/Confetti";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { RPSChoice, RPSResult } from "@/types";

const CHOICES: { id: RPSChoice; emoji: string; label: string; beats: RPSChoice }[] = [
  { id: "rock", emoji: "🪨", label: "Rock", beats: "scissors" },
  { id: "paper", emoji: "📄", label: "Paper", beats: "rock" },
  { id: "scissors", emoji: "✂️", label: "Scissors", beats: "paper" },
];

function getResult(player: RPSChoice, ai: RPSChoice): RPSResult {
  if (player === ai) return "draw";
  const choice = CHOICES.find((c) => c.id === player)!;
  return choice.beats === ai ? "win" : "lose";
}

function getRandomChoice(): RPSChoice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
}

interface RoundResult {
  player: RPSChoice;
  ai: RPSChoice;
  result: RPSResult;
}

export function RPSGame() {
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0, streak: 0, best: 0 });
  const [currentRound, setCurrentRound] = useState<RoundResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const { player, updateStats } = usePlayer();
  const { addScore } = useLeaderboard();
  const { playSound } = useSound();

  const handleChoice = useCallback(
    async (playerChoice: RPSChoice) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setShowConfetti(false);

      const aiChoice = getRandomChoice();
      const result = getResult(playerChoice, aiChoice);

      await new Promise((r) => setTimeout(r, 600));

      const round: RoundResult = { player: playerChoice, ai: aiChoice, result };
      setCurrentRound(round);

      setScore((prev) => {
        const newStreak = result === "win" ? prev.streak + 1 : 0;
        const newBest = Math.max(prev.best, newStreak);
        const newScore = {
          wins: result === "win" ? prev.wins + 1 : prev.wins,
          losses: result === "lose" ? prev.losses + 1 : prev.losses,
          draws: result === "draw" ? prev.draws + 1 : prev.draws,
          streak: newStreak,
          best: newBest,
        };

        const pts = result === "win" ? (10 + newStreak * 5) : result === "draw" ? 3 : 0;
        const newTotal = totalScore + pts;
        setTotalScore(newTotal);

        if (result === "win") {
          playSound("win");
          if (newStreak >= 3) setShowConfetti(true);
        } else if (result === "lose") {
          playSound("lose");
        } else {
          playSound("move");
        }

        if (player) {
          addScore({
            playerId: player.id,
            playerName: player.name,
            gameId: "rock-paper-scissors",
            gameName: "Rock Paper Scissors",
            score: newTotal,
            metadata: { wins: newScore.wins, streak: newBest },
          });
          updateStats("rock-paper-scissors", pts, result);
        }

        return newScore;
      });

      setIsAnimating(false);
    },
    [isAnimating, totalScore, player, addScore, updateStats, playSound]
  );

  const reset = useCallback(() => {
    setScore({ wins: 0, losses: 0, draws: 0, streak: 0, best: 0 });
    setCurrentRound(null);
    setTotalScore(0);
    setShowConfetti(false);
  }, []);

  const totalGames = score.wins + score.losses + score.draws;
  const winRate = totalGames > 0 ? Math.round((score.wins / totalGames) * 100) : 0;

  return (
    <GameWrapper
      gameId="rock-paper-scissors"
      gameName="Rock Paper Scissors"
      gameColor="from-orange-500 to-red-600"
      currentScore={totalScore}
      onReset={reset}
    >
      <Confetti trigger={showConfetti} type="achievement" />

      <div className="flex flex-col items-center gap-8 max-w-lg mx-auto">
        {/* Score Cards */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {[
            { label: "Wins", value: score.wins, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { label: "Losses", value: score.losses, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
            { label: "Draws", value: score.draws, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
            { label: "Streak", value: score.streak, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: "🔥" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className={`p-3 rounded-xl border text-center ${stat.bg}`}
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-black font-display ${stat.color}`}>
                {stat.icon && score.streak >= 3 ? stat.icon : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Win Rate */}
        {totalGames > 0 && (
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Win rate {winRate}%
            </span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <Trophy className="w-3 h-3 text-yellow-400" />
              Best: {score.best}🔥
            </div>
          </div>
        )}

        {/* Battle Arena */}
        <div className="w-full glass-card p-8">
          <div className="flex items-center justify-between gap-4">
            {/* Player Side */}
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-3">You</p>
              <motion.div
                animate={isAnimating ? { rotate: [0, -20, 20, -20, 20, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-6xl sm:text-7xl"
              >
                {currentRound ? (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentRound.player}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {CHOICES.find((c) => c.id === currentRound.player)?.emoji}
                    </motion.span>
                  </AnimatePresence>
                ) : (
                  <span className="opacity-30">❓</span>
                )}
              </motion.div>
            </div>

            {/* VS */}
            <div className="text-center">
              <AnimatePresence mode="wait">
                {currentRound ? (
                  <motion.div
                    key={currentRound.result}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-2xl font-black font-display px-4 py-2 rounded-xl ${
                      currentRound.result === "win"
                        ? "text-green-400 bg-green-500/10"
                        : currentRound.result === "lose"
                        ? "text-red-400 bg-red-500/10"
                        : "text-yellow-400 bg-yellow-500/10"
                    }`}
                  >
                    {currentRound.result === "win" ? "WIN!" : currentRound.result === "lose" ? "LOSE" : "DRAW"}
                  </motion.div>
                ) : (
                  <motion.span className="text-muted-foreground font-bold text-xl">
                    VS
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* AI Side */}
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-3">AI</p>
              <motion.div
                animate={isAnimating ? { rotate: [0, 20, -20, 20, -20, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-6xl sm:text-7xl"
              >
                {currentRound ? (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentRound.ai}
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {CHOICES.find((c) => c.id === currentRound.ai)?.emoji}
                    </motion.span>
                  </AnimatePresence>
                ) : isAnimating ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block"
                  >
                    🤖
                  </motion.span>
                ) : (
                  <span className="opacity-30">🤖</span>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Choice Buttons */}
        <div className="flex items-center gap-4">
          {CHOICES.map((choice) => (
            <motion.button
              key={choice.id}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(choice.id)}
              disabled={isAnimating}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-card
                         hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 min-w-[90px] cursor-pointer
                         hover:shadow-xl hover:shadow-purple-500/10"
            >
              <span className="text-4xl">{choice.emoji}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {choice.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Score Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Score: <span className="text-foreground font-medium">{totalScore}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>+{score.streak > 0 ? `${5 * score.streak} bonus` : "10 per win"}</span>
          </div>
        </div>
      </div>
    </GameWrapper>
  );
}
