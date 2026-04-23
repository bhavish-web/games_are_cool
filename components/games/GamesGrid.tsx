"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronRight, Star } from "lucide-react";
import { GAMES } from "@/lib/utils";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePlayer } from "@/hooks/usePlayer";

const ALL_TAGS = ["All", "Strategy", "Arcade", "Memory", "Puzzle", "Timed", "Quick", "Reflex", "Speed", "Classic", "AI", "Skill"];

export function GamesGrid() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const { getPlayerBest } = useLeaderboard();
  const { player } = usePlayer();

  const filtered = GAMES.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) ||
                          game.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === "All" || game.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-2">
          Game Library
        </p>
        <h1 className="text-4xl sm:text-5xl font-black font-display gradient-text mb-4">
          All Games
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Choose from our collection of premium browser games. Each game tracks your 
          progress and competes on global leaderboards.
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Games Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((game, index) => {
            const best = player ? getPlayerBest(player.id, game.id) : null;

            return (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Link href={game.href}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative h-full p-6 glass-card overflow-hidden cursor-pointer
                               hover:border-white/20 transition-all duration-300"
                  >
                    {/* Gradient bg */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${game.gradient} 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    <div className="relative z-10">
                      {/* Top Row */}
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} 
                                      flex items-center justify-center text-2xl
                                      shadow-lg group-hover:scale-110 transition-transform duration-300
                                      font-display font-bold text-white`}
                        >
                          {game.icon}
                        </div>
                        {best && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full 
                                          bg-yellow-500/10 border border-yellow-500/20">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-300">
                              {best.score}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-display mb-2">
                        {game.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {game.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-xs rounded-full bg-white/5 
                                       border border-white/10 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div
                        className={`flex items-center justify-between pt-4 
                                    border-t border-white/5`}
                      >
                        <span className={`text-sm font-semibold bg-gradient-to-r ${game.color} 
                                          bg-clip-text text-transparent`}>
                          Play Now
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground 
                                                  group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-6xl mb-4">🎮</p>
          <h3 className="text-xl font-bold mb-2">No games found</h3>
          <p className="text-muted-foreground">Try a different search or filter</p>
        </motion.div>
      )}
    </div>
  );
}
