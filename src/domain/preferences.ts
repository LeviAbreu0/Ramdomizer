import { activityCategories, Feedback, UserPreferences } from '@/types/domain';

const MIN_WEIGHT = 0.35;
const MAX_WEIGHT = 1.8;

export function createDefaultPreferences(): UserPreferences {
  return {
    categoryWeights: Object.fromEntries(
      activityCategories.map((category) => [category, 1]),
    ) as UserPreferences['categoryWeights'],
    blockedActivityIds: [],
  };
}

export function applyFeedback(
  preferences: UserPreferences,
  activityId: string,
  category: keyof UserPreferences['categoryWeights'],
  feedback: Feedback,
  wantMore = false,
): UserPreferences {
  const feedbackDelta: Record<Feedback, number> = {
    loved: 0.12,
    liked: 0.06,
    meh: -0.08,
    never: -0.22,
  };
  const current = preferences.categoryWeights[category] ?? 1;
  const nextWeight = Math.min(
    MAX_WEIGHT,
    Math.max(MIN_WEIGHT, current + feedbackDelta[feedback] + (wantMore ? 0.08 : 0)),
  );
  const shouldBlock = feedback === 'never';

  return {
    categoryWeights: { ...preferences.categoryWeights, [category]: nextWeight },
    blockedActivityIds:
      shouldBlock && !preferences.blockedActivityIds.includes(activityId)
        ? [...preferences.blockedActivityIds, activityId]
        : preferences.blockedActivityIds,
  };
}

export function blockActivity(
  preferences: UserPreferences,
  activityId: string,
): UserPreferences {
  if (preferences.blockedActivityIds.includes(activityId)) return preferences;
  return {
    ...preferences,
    blockedActivityIds: [...preferences.blockedActivityIds, activityId],
  };
}
