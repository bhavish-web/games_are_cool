"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  label?: string;
  icon?: "trophy" | "star" | "zap" | "clock";
  size?: "sm" | "md" | "lg";
  color?: "purple" | "green" | "blue" | "yellow" | "red";
  animated?: boolean;
  suffix?: string;
}

const ICON_MAP = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  clock: Clock,
};

const COLOR_MAP = {
  purple: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300",
  green: "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300",
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
  yellow: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-300",
  red: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300",
};

const SIZE_MAP = {
  sm: { container: "px-3 py-1.5", icon: "w-3.5 h-3.5", value: "text-lg", label: "text-xs" },
  md: { container: "px-4 py-2.5", icon: "w-4 h-4", value: "text-2xl", label: "text-sm" },
  lg: { container: "px-6 py-4", icon: "w-5 h-5", value: "text-4xl", label: "text-base" },
};

export function ScoreDisplay({
  score,
  label = "Score",
  icon = "trophy",
  size = "md",
  color = "purple",
  animated = true,
  suffix = "",
}: ScoreDisplayProps) {
  const Icon = ICON_MAP[icon];
  const colorClass = COLOR_MAP[color];
  const sizeClass = SIZE_MAP[size];

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-xl",
        "bg-gradient-to-br border backdrop-blur-sm",
        colorClass,
        sizeClass.container
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={cn(sizeClass.icon, "opacity-80")} />
        <span className={cn("font-medium opacity-80", sizeClass.label)}>
          {label}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={score}
          initial={animated ? { scale: 1.3, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn("font-bold font-display tabular-nums", sizeClass.value)}
        >
          {score.toLocaleString()}{suffix}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
