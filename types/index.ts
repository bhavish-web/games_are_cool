export interface Player {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface GameScore {
  id: string;
  playerId: string;
  playerName: string;
  gameId: string;
  gameName: string;
  score: number;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  unlockedAt?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalScore: number;
  wins: number;
  losses: number;
  draws: number;
  bestScores: Record<string, number>;
  achievements: string[];
  streaks: Record<string, number>;
}

export type Difficulty = "easy" | "medium" | "hard";

export type GameId = 
  | "tic-tac-toe" 
  | "snake" 
  | "memory-match" 
  | "rock-paper-scissors" 
  | "reaction-time";

export interface GameConfig {
  id: GameId;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tags: string[];
  href: string;
  highScoreKey: string;
  isHigherBetter: boolean;
}

export type SnakeDirection = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface SnakeCell {
  x: number;
  y: number;
}

export type TicTacToeBoard = (string | null)[];

export type RPSChoice = "rock" | "paper" | "scissors";
export type RPSResult = "win" | "lose" | "draw";

export interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  gameId: string;
  createdAt: number;
}

export type ThemeMode = "dark" | "light";

export interface SoundSettings {
  enabled: boolean;
  volume: number;
}
