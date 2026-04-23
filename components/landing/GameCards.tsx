"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { GAMES } from "@/lib/utils";

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function GameCards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-3">
            Game Library
          </p>
          <h2 className="text-4xl sm:text-5xl font-black font-display mb-4">
            <span className="gradient-text">Choose Your</span>{" "}
            <span className="text-foreground">Challenge</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From classic arcade to mind-bending puzzles — every game tracks your progress
            and competes on the global leaderboard.
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          ref={ref}
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              variants={CARD_VARIANTS}
              className="group"
            >
              <Link href={game.href}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative h-full p-6 glass-card overflow-hidden cursor-pointer
                             hover:border-white/20 transition-all duration-300
                             hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${game.gradient} 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Glow on hover */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${game.color} 
                                opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`}
                  />

                  <div className="relative z-10">
                    {/* Game Icon */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} 
                                  flex items-center justify-center text-2xl mb-5
                                  shadow-lg group-hover:scale-110 transition-transform duration-300
                                  font-display font-bold text-white`}
                    >
                      {game.icon}
                    </div>

                    {/* Game Info */}
                    <h3 className="text-xl font-bold font-display mb-2 group-hover:gradient-text 
                                   transition-all duration-200">
                      {game.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
                      {game.description}
                    </p>

                    {/* Tags */}
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

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold bg-gradient-to-r ${game.color} 
                                    bg-clip-text text-transparent`}
                      >
                        Play Now
                      </span>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 
                                   flex items-center justify-center
                                   group-hover:border-white/20 transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/games">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-ghost group"
            >
              View All Games
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
