"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, RotateCcw, Cpu, User } from "lucide-react";
import { GameWrapper } from "@/components/shared/GameWrapper";
import { Confetti } from "@/components/shared/Confetti";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { getBestMove, checkWinner, getWinningCells, WINNING_COMBINATIONS } from "@/lib/minimax";
import { TicTacToeBoard, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

const INITIAL_BOARD: TicTacToeBoard = Array(9).fill(null);

type GameStatus = "playing" | "won" | "lost" | "draw";

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  hard: { label: "Hard", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export function TicTacToeGame() {
  const [board, setBoard] = useState<TicTacToeBoard>(INITIAL_BOARD);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [winningCells, setWinningCells] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { player, updateStats } = usePlayer();
  const { addScore } = useLeaderboard();
  const { playSound } = useSound();

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setWinningCells(null);
    setIsAIThinking(false);
    setShowConfetti(false);
  }, []);

  const endGame = useCallback(
    (status: GameStatus, finalBoard: TicTacToeBoard) => {
      setGameStatus(status);
      const cells = getWinningCells(finalBoard);
      setWinningCells(cells);

      if (status === "won") {
        playSound("win");
        setShowConfetti(true);
        setScore((prev) => ({ ...prev, wins: prev.wins + 1 }));
        if (player) {
          const pts = difficulty === "hard" ? 300 : difficulty === "medium" ? 200 : 100;
          addScore({
            playerId: player.id,
            playerName: player.name,
            gameId: "tic-tac-toe",
            gameName: "Tic Tac Toe",
            score: pts,
            metadata: { difficulty },
          });
          updateStats("tic-tac-toe", pts, "win");
          if (difficulty === "hard") {
            updateStats("tic-tac-toe-hard", 1, "win");
          }
        }
      } else if (status === "lost") {
        playSound("lose");
        setScore((prev) => ({ ...prev, losses: prev.losses + 1 }));
        if (player) updateStats("tic-tac-toe", 0, "lose");
      } else {
        playSound("move");
        setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        if (player) updateStats("tic-tac-toe", 50, "draw");
      }
    },
    [difficulty, player, addScore, updateStats, playSound]
  );

  const handleCellClick = useCallback(
    (index: number) => {
      if (!isPlayerTurn || board[index] || gameStatus !== "playing" || isAIThinking) return;

      playSound("move");
      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      const winner = checkWinner(newBoard);
      if (winner === "X") {
        endGame("won", newBoard);
        return;
      }
      if (newBoard.every(Boolean)) {
        endGame("draw", newBoard);
        return;
      }

      setIsPlayerTurn(false);
    },
    [board, isPlayerTurn, gameStatus, isAIThinking, endGame, playSound]
  );

  // AI Move
  useEffect(() => {
    if (isPlayerTurn || gameStatus !== "playing") return;

    setIsAIThinking(true);
    const delay = difficulty === "easy" ? 300 : difficulty === "medium" ? 500 : 800;

    const timer = setTimeout(() => {
      const aiMove = getBestMove(board, difficulty);
      if (aiMove === -1) return;

      playSound("move");
      const newBoard = [...board];
      newBoard[aiMove] = "O";
      setBoard(newBoard);

      const winner = checkWinner(newBoard);
      if (winner === "O") {
        endGame("lost", newBoard);
      } else if (newBoard.every(Boolean)) {
        endGame("draw", newBoard);
      } else {
        setIsPlayerTurn(true);
      }
      setIsAIThinking(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, gameStatus, board, difficulty, endGame, playSound]);

  const totalScore = score.wins * (difficulty === "hard" ? 300 : difficulty === "medium" ? 200 : 100);

  return (
    <GameWrapper
      gameId="tic-tac-toe"
      gameName="Tic Tac Toe"
      gameColor="from-violet-500 to-purple-600"
      currentScore={totalScore}
      onReset={resetGame}
    >
      <Confetti trigger={showConfetti} type="winner" />

      <div className="flex flex-col items-center gap-8 max-w-lg mx-auto">
        {/* Difficulty Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
            <motion.button
              key={d}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDifficulty(d);
                resetGame();
              }}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                difficulty === d
                  ? `${DIFFICULTY_CONFIG[d].bg} ${DIFFICULTY_CONFIG[d].color} border`
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {DIFFICULTY_CONFIG[d].label}
            </motion.button>
          ))}
        </div>

        {/* Score */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-muted-foreground">You</span>
            </div>
            <div className="text-3xl font-black font-display text-blue-400">
              {score.wins}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Draws</div>
            <div className="text-3xl font-black font-display text-muted-foreground">
              {score.draws}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-muted-foreground">AI</span>
            </div>
            <div className="text-3xl font-black font-display text-red-400">
              {score.losses}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <AnimatePresence mode="wait">
          {gameStatus === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl 
                         bg-white/5 border border-white/10"
            >
              {isAIThinking ? (
                <>
                  <Cpu className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-red-500/30 border-t-red-500 rounded-full"
                  />
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Your turn — play X</span>
                </>
              )}
            </motion.div>
          )}

          {gameStatus !== "playing" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl border",
                gameStatus === "won" && "bg-green-500/10 border-green-500/30 text-green-400",
                gameStatus === "lost" && "bg-red-500/10 border-red-500/30 text-red-400",
                gameStatus === "draw" && "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
              )}
            >
              <span className="text-2xl">
                {gameStatus === "won" ? "🏆" : gameStatus === "lost" ? "💀" : "🤝"}
              </span>
              <div>
                <p className="font-bold">
                  {gameStatus === "won" ? "You Win!" : gameStatus === "lost" ? "AI Wins!" : "It's a Draw!"}
                </p>
                <p className="text-xs opacity-80">
                  {gameStatus === "won"
                    ? `+${difficulty === "hard" ? 300 : difficulty === "medium" ? 200 : 100} points`
                    : gameStatus === "draw" ? "+50 points" : "Better luck next time!"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 p-4 glass-card">
          {board.map((cell, index) => {
            const isWinningCell = winningCells?.includes(index);

            return (
              <motion.button
                key={index}
                whileHover={!cell && gameStatus === "playing" ? { scale: 0.95 } : {}}
                whileTap={!cell && gameStatus === "playing" ? { scale: 0.9 } : {}}
                onClick={() => handleCellClick(index)}
                className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 transition-all duration-200",
                  "flex items-center justify-center",
                  "font-black text-4xl sm:text-5xl font-display",
                  !cell && gameStatus === "playing"
                    ? "border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer"
                    : "cursor-default",
                  cell === "X" && !isWinningCell && "border-blue-500/30 bg-blue-500/5 text-blue-400",
                  cell === "O" && !isWinningCell && "border-red-500/30 bg-red-500/5 text-red-400",
                  isWinningCell && cell === "X" && "border-green-500/50 bg-green-500/20 text-green-400 neon-border-blue",
                  isWinningCell && cell === "O" && "border-red-500/50 bg-red-500/20 text-red-400",
                  !cell && "border-white/5 bg-white/3"
                )}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Play Again */}
        {gameStatus !== "playing" && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </motion.button>
        )}

        {/* AI Difficulty Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Brain className="w-3.5 h-3.5" />
          <span>
            AI uses{" "}
            <span className="text-purple-400 font-medium">
              {difficulty === "hard" ? "Minimax algorithm" : difficulty === "medium" ? "Mixed strategy" : "Random moves"}
            </span>
          </span>
        </div>
      </div>
    </GameWrapper>
  );
}
