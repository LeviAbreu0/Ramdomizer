import { Activity, AchievementId, PlayerProfile, RunRecord } from '@/types/domain';

export function createDefaultProfile(): PlayerProfile {
  return { xp: 0, unlockedAchievements: [], firstSuggestionStreak: 0 };
}

export function calculateRunXp(activity: Activity): number {
  const durationXp = Math.min(activity.estimatedMinutes, 180) * 1.15;
  const entropyXp = activity.entropyLevel * 0.75;
  const blindXp = activity.isBlind ? Math.max(activity.steps.length, 2) * 18 : 0;
  return Math.round(30 + durationXp + entropyXp + blindXp);
}

export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 180)) + 1;
}

export function getLevelProgress(xp: number): {
  current: number;
  required: number;
  ratio: number;
} {
  const level = getLevel(xp);
  const floor = (level - 1) ** 2 * 180;
  const ceiling = level ** 2 * 180;
  return {
    current: xp - floor,
    required: ceiling - floor,
    ratio: (xp - floor) / (ceiling - floor),
  };
}

export function completeProfile(
  profile: PlayerProfile,
  completedRun: RunRecord,
  history: RunRecord[],
): { profile: PlayerProfile; unlockedNow: AchievementId[] } {
  const firstSuggestionStreak = completedRun.wasFirstSuggestion
    ? profile.firstSuggestionStreak + 1
    : 0;
  const completed = history.filter((run) => run.status === 'completed');
  const eligible = new Set<AchievementId>();

  if (completed.filter((run) => run.wasFirstSuggestion).length >= 10)
    eligible.add('trust-the-dice');
  if (completed.filter((run) => run.category === 'Outdoor').length >= 10)
    eligible.add('touch-grass');
  if (completed.filter((run) => run.budget === 0).length >= 20)
    eligible.add('zero-budget');
  if (new Set(completed.map((run) => run.category)).size >= 10)
    eligible.add('jack-of-all-trades');
  if (firstSuggestionStreak >= 5) eligible.add('no-reroll');
  if (completed.filter((run) => run.entropyLevel >= 75).length >= 10)
    eligible.add('chaos-enjoyer');

  const unlockedNow = [...eligible].filter(
    (id) => !profile.unlockedAchievements.includes(id),
  );
  return {
    profile: {
      xp: profile.xp + (completedRun.xpEarned ?? 0),
      firstSuggestionStreak,
      unlockedAchievements: [...profile.unlockedAchievements, ...unlockedNow],
    },
    unlockedNow,
  };
}
