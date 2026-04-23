"use client";

const games = [
  { name: "Memory Match", href: "/games/memory-match" },
  { name: "Reaction Time", href: "/games/reaction-time" },
  { name: "Rock Paper Scissors", href: "/games/rock-paper-scissors" },
  { name: "Snake", href: "/games/snake" },
];

export default function GamesGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {games.map((game) => (
        <a
          key={game.name}
          href={game.href}
          className="p-6 border rounded-lg hover:bg-gray-100 text-center font-semibold"
        >
          {game.name}
        </a>
      ))}
    </div>
  );
}
