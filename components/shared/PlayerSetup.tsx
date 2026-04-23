"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_NAMES = ["Shadow", "Nexus", "Phantom", "Volt", "Cipher", "Nova", "Titan", "Apex"];

interface PlayerSetupProps {
  onComplete: (name: string) => void;
  className?: string;
}

export function PlayerSetup({ onComplete, className }: PlayerSetupProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (playerName: string) => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Name must be under 20 characters");
      return;
    }
    onComplete(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "w-full max-w-md mx-auto p-8 glass-card",
        className
      )}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br 
                     from-purple-500 to-blue-600 flex items-center justify-center
                     shadow-xl shadow-purple-500/30"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold font-display gradient-text mb-2">
          Enter the Vault
        </h2>
        <p className="text-sm text-muted-foreground">
          Set your player name to track scores and achievements
        </p>
      </div>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground/80 mb-2">
          Player Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(name)}
            placeholder="Enter your username..."
            className="input-field pl-10"
            maxLength={20}
            autoFocus
          />
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-400 mt-1.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Names */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">Quick picks:</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_NAMES.map((quickName) => (
            <motion.button
              key={quickName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setName(quickName);
                setError("");
              }}
              className={cn(
                "px-3 py-1 text-xs rounded-lg border transition-all duration-200",
                name === quickName
                  ? "border-purple-500/50 bg-purple-500/20 text-purple-300"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {quickName}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSubmit(name)}
        className="btn-primary w-full group"
      >
        <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
        Start Playing
        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Your progress is saved locally
      </p>
    </motion.div>
  );
}
