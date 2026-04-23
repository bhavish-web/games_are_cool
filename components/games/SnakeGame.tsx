"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { GameWrapper } from "@/components/shared/GameWrapper";
import { ScoreDisplay } from "@/components/shared/ScoreDisplay";
import { Confetti } from "@/components/shared/Confetti";
import { usePlayer } from "@/hooks/usePlayer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { SnakeCell, SnakeDirection } from "@/types";

const GRID_SIZE = 20;
const INITIAL_SNAKE: SnakeCell[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION: SnakeDirection = "RIGHT";
const BASE_SPEED = 150;

function getRandomFood(snake: SnakeCell[]): SnakeCell {
  let food: SnakeCell;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

function getSpeed(score: number): number {
  const level = Math.floor(score / 5);
  return Math.max(60, BASE_SPEED - level * 8);
}

type GameState = "idle" | "playing" | "paused" | "gameover";

export function SnakeGame() {
  const [snake, setSnake] = useState<SnakeCell[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<SnakeDirection>(INITIAL_DIRECTION);
  const [food, setFood] = useState<SnakeCell>({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  const directionRef = useRef<SnakeDirection>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<ReturnType<typeof setTimeout>>();
  const scoreRef = useRef(0);

  const { player, updateStats } = usePlayer();
  const { addScore } = useLeaderboard();
  const { playSound } = useSound();

  const resetGame = useCallback(() => {
    clearTimeout(gameLoopRef.current);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    scoreRef.current = 0;
    setGameState("idle");
    setShowConfetti(false);
  }, []);

  const gameOver = useCallback(() => {
    clearTimeout(gameLoopRef.current);
    playSound("lose");
    
    const finalScore = scoreRef.current;
    setHighScore((prev) => {
      const newHigh = Math.max(prev, finalScore);
      if (finalScore > 0 && finalScore >= prev) {
        setShowConfetti(true);
      }
      return newHigh;
    });

    if (player && finalScore > 0) {
      const points = finalScore * 10;
      addScore({
        playerId: player.id,
        playerName: player.name,
        gameId: "snake",
        gameName: "Snake",
        score: points,
        metadata: { foodEaten: finalScore },
      });
      updateStats("snake", points, finalScore > 0 ? "win" : "lose");
    }

    setGameState("gameover");
  }, [player, addScore, updateStats, playSound]);

  const tick = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      const dir = directionRef.current;

      let newHead: SnakeCell;
      switch (dir) {
        case "UP": newHead = { x: head.x, y: head.y - 1 }; break;
        case "DOWN": newHead = { x: head.x, y: head.y + 1 }; break;
        case "LEFT": newHead = { x: head.x - 1, y: head.y }; break;
        case "RIGHT": newHead = { x: head.x + 1, y: head.y }; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prev;
      }

      // Self collision
      if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        gameOver();
        return prev;
      }

      const ateFood = newHead.x === food.x && newHead.y === food.y;
      const newSnake = ateFood ? [newHead, ...prev] : [newHead, ...prev.slice(0, -1)];

      if (ateFood) {
        playSound("match");
        const newScore = scoreRef.current + 1;
        scoreRef.current = newScore;
        setScore(newScore);
        setFood(getRandomFood(newSnake));
      }

      return newSnake;
    });
  }, [food, gameOver, playSound]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const speed = getSpeed(scoreRef.current);
    gameLoopRef.current = setTimeout(tick, speed);
    return () => clearTimeout(gameLoopRef.current);
  }, [gameState, tick, snake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirMap: Record<string, SnakeDirection> = {
        ArrowUp: "UP", ArrowDown: "DOWN",
        ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };

      const opposites: Record<SnakeDirection, SnakeDirection> = {
        UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
      };

      const newDir = dirMap[e.key];
      if (!newDir) return;

      e.preventDefault();
      if (newDir !== opposites[directionRef.current]) {
        directionRef.current = newDir;
        setDirection(newDir);
      }

      if (gameState === "idle") {
        setGameState("playing");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const handleDirectionBtn = (dir: SnakeDirection) => {
    const opposites: Record<SnakeDirection, SnakeDirection> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };
    if (dir !== opposites[directionRef.current]) {
      directionRef.current = dir;
      setDirection(dir);
    }
    if (gameState === "idle") setGameState("playing");
  };

  const togglePause = () => {
    setGameState((prev) => prev === "playing" ? "paused" : "playing");
  };

  const cellSize = Math.floor(Math.min(
    typeof window !== "undefined" ? (window.innerWidth - 64) / GRID_SIZE : 400 / GRID_SIZE,
    500 / GRID_SIZE
  ));

  return (
    <GameWrapper
      gameId="snake"
      gameName="Snake"
      gameColor="from-emerald-500 to-green-600"
      currentScore={score * 10}
      onReset={resetGame}
    >
      <Confetti trigger={showConfetti} type="achievement" />

      <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
        {/* Scores */}
        <div className="flex items-center gap-4">
          <ScoreDisplay
            score={score * 10}
            label="Score"
            icon="star"
            color="green"
            size="md"
          />
          <ScoreDisplay
            score={highScore * 10}
            label="Best"
            icon="trophy"
            color="yellow"
            size="md"
          />
          <div className="text-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-muted-foreground mb-0.5">Level</p>
            <p className="text-2xl font-black font-display text-purple-400">
              {Math.floor(score / 5) + 1}
            </p>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div
            className="grid gap-px bg-white/3 rounded-xl overflow-hidden 
                       border border-white/8 shadow-2xl shadow-black/50"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: GRID_SIZE * 20 + "px",
              height: GRID_SIZE * 20 + "px",
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              const bodyIndex = snake.findIndex((s) => s.x === x && s.y === y);

              return (
                <div
                  key={i}
                  className={cn(
                    "transition-all duration-75",
                    isHead && "bg-emerald-400 rounded-sm shadow-lg shadow-emerald-400/50",
                    isBody && `bg-emerald-500/80 rounded-sm`,
                    isFood && "bg-red-400 rounded-full shadow-lg shadow-red-400/50",
                    !isHead && !isBody && !isFood && "bg-transparent"
                  )}
                  style={
                    isBody && bodyIndex > 0
                      ? { opacity: Math.max(0.4, 1 - bodyIndex * 0.04) }
                      : undefined
                  }
                />
              );
            })}
          </div>

          {/* Overlay States */}
          <AnimatePresence>
            {gameState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center 
                           bg-black/70 backdrop-blur-sm rounded-xl"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🐍</div>
                  <h3 className="text-xl font-bold mb-2">Ready to Play?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use arrow keys or WASD to control
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameState("playing")}
                    className="btn-primary"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </motion.button>
                </div>
              </motion.div>
            )}

            {gameState === "paused" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center 
                           bg-black/70 backdrop-blur-sm rounded-xl"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">⏸️</div>
                  <h3 className="text-xl font-bold mb-4">Paused</h3>
                  <button onClick={togglePause} className="btn-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === "gameover" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center 
                           bg-black/80 backdrop-blur-sm rounded-xl"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">💀</div>
                  <h3 className="text-2xl font-black mb-1">Game Over!</h3>
                  <p className="text-muted-foreground mb-1">Score: {score * 10}</p>
                  {score * 10 >= highScore * 10 && score > 0 && (
                    <p className="text-yellow-400 text-sm mb-4">🏆 New High Score!</p>
                  )}
                  <button onClick={resetGame} className="btn-primary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            disabled={gameState === "idle" || gameState === "gameover"}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gameState === "playing" ? (
              <><Pause className="w-4 h-4 mr-2" />Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2" />Resume</>
            )}
          </motion.button>
          <button onClick={resetGame} className="btn-ghost">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>

        {/* Mobile D-Pad */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          <div />
          <button
            onTouchStart={() => handleDirectionBtn("UP")}
            onClick={() => handleDirectionBtn("UP")}
            className="w-14 h-14 flex items-center justify-center rounded-xl 
                       bg-white/10 border border-white/20 active:bg-white/20"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <div />
          <button
            onTouchStart={() => handleDirectionBtn("LEFT")}
            onClick={() => handleDirectionBtn("LEFT")}
            className="w-14 h-14 flex items-center justify-center rounded-xl 
                       bg-white/10 border border-white/20 active:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleDirectionBtn("DOWN")}
            onClick={() => handleDirectionBtn("DOWN")}
            className="w-14 h-14 flex items-center justify-center rounded-xl 
                       bg-white/10 border border-white/20 active:bg-white/20"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          <button
            onTouchStart={() => handleDirectionBtn("RIGHT")}
            onClick={() => handleDirectionBtn("RIGHT")}
            className="w-14 h-14 flex items-center justify-center rounded-xl 
                       bg-white/10 border border-white/20 active:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground hidden md:block">
          Use ↑↓←→ or WASD to control the snake
        </p>
      </div>
    </GameWrapper>
  );
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
