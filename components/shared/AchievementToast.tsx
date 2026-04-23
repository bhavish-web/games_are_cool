"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENTS } from "@/hooks/useAchievements";
import { Achievement } from "@/types";
import { Confetti } from "./Confetti";

interface AchievementToastProps {
  achievementIds: string[];
}

export function AchievementToast({ achievementIds }: AchievementToastProps) {
  const [visible, setVisible] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievementIds.length > 0) {
      const unlocked = ACHIEVEMENTS.filter((a) => achievementIds.includes(a.id));
      setVisible(unlocked);
      setShowConfetti(true);
      setTimeout(() => {
        setVisible([]);
        setShowConfetti(false);
      }, 4000);
    }
  }, [achievementIds]);

  return (
    <>
      <Confetti trigger={showConfetti} type="achievement" />
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <AnimatePresence>
          {visible.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 p-4 rounded-xl glass-card
                         border border-yellow-500/30 bg-yellow-500/10 min-w-[250px]"
            >
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Achievement Unlocked!
                  </span>
                </div>
                <p className="font-semibold text-sm text-foreground">
                  {achievement.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
