"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Zap, Trophy, Users } from "lucide-react";

const ANIMATED_WORDS = ["Legendary", "Intense", "Thrilling", "Epic", "Ultimate"];

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % ANIMATED_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center 
                        px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full 
                     bg-purple-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full 
                     bg-blue-600/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                     bg-purple-500/10 border border-purple-500/20 text-sm 
                     text-purple-300 mb-8 backdrop-blur-sm"
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium">5 Premium Games · Zero Downloads</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs">Live</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black font-display 
                         leading-none tracking-tight mb-6">
            <span className="gradient-text">{" "}
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="inline-block"
              >
                {ANIMATED_WORDS[currentWord]}
              </motion.span>
            </span>
            <br />
            <span className="text-foreground">Gaming</span>
            <span className="gradient-text"> Starts</span>
            <br />
            <span className="text-foreground/60">Here</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Play premium browser games, climb global leaderboards, and unlock achievements.{" "}
          <span className="text-foreground/80 font-medium">No downloads. No accounts required.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/games">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-base px-10 py-4 rounded-2xl group"
            >
              <Gamepad2 className="w-5 h-5 mr-2.5" />
              Play Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-ghost text-base px-8 py-4 rounded-2xl"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Leaderboard
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm"
        >
          {[
            { icon: Gamepad2, label: "5 Games", color: "text-purple-400" },
            { icon: Trophy, label: "Live Leaderboard", color: "text-yellow-400" },
            { icon: Zap, label: "Instant Play", color: "text-blue-400" },
            { icon: Users, label: "Achievements", color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start 
                     justify-center p-1.5"
        >
          <motion.div className="w-1 h-2.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
