import { TicTacToeBoard } from "@/types";

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function checkWinner(board: TicTacToeBoard): string | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as string;
    }
  }
  return null;
}

export function getWinningCells(board: TicTacToeBoard): number[] | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

function minimax(
  board: TicTacToeBoard,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number {
  const winner = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

export function getBestMove(
  board: TicTacToeBoard,
  difficulty: "easy" | "medium" | "hard"
): number {
  const emptySquares = board.reduce<number[]>((acc, cell, i) => {
    if (!cell) acc.push(i);
    return acc;
  }, []);

  if (emptySquares.length === 0) return -1;

  // Easy: random move
  if (difficulty === "easy") {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  // Medium: 50% chance of optimal move
  if (difficulty === "medium" && Math.random() < 0.5) {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  // Hard: always optimal (minimax)
  let bestScore = -Infinity;
  let bestMove = emptySquares[0];

  for (const move of emptySquares) {
    const newBoard = [...board];
    newBoard[move] = "O";
    const score = minimax(newBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
