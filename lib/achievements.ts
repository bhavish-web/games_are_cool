import { ACHIEVEMENTS } from "@/hooks/useAchievements";
import { PlayerStats } from "@/types";

export function getNewlyUnlockedAchievements(
  oldStats: PlayerStats,
  newStats: PlayerStats
) {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !oldStats.achievements.includes(achievement.id) &&
      achievement.condition(newStats)
  );
}
