"use client";

export default function GamesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <a href="/games/memory-match" className="p-6 bg-white rounded-lg shadow hover:bg-gray-100 text-center">Memory Match</a>
      <a href="/games/reaction-time" className="p-6 bg-white rounded-lg shadow hover:bg-gray-100 text-center">Reaction Time</a>
      <a href="/games/rock-paper-scissors" className="p-6 bg-white rounded-lg shadow hover:bg-gray-100 text-center">Rock Paper Scissors</a>
      <a href="/games/snake" className="p-6 bg-white rounded-lg shadow hover:bg-gray-100 text-center">Snake</a>
    </div>
  );
}