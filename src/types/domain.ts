export const activityCategories = [
  'Gaming',
  'Music',
  'Outdoor',
  'Reading',
  'Learning',
  'Creative',
  'Cooking',
  'Entertainment',
  'Exploration',
  'Relaxation',
  'Productive',
  'Chaos',
] as const;

export type ActivityCategory = (typeof activityCategories)[number];
export type ActivityLocation = 'home' | 'outside' | 'public';
export type Company = 'alone' | 'accompanied';
export type Transportation = 'none' | 'walk' | 'bike' | 'vehicle';
export type EnergyLevel = 1 | 2 | 3;
export type RunStatus = 'generated' | 'accepted' | 'completed' | 'abandoned' | 'rerolled';
export type Feedback = 'loved' | 'liked' | 'meh' | 'never';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  estimatedMinutes: number;
  minBudget: number;
  maxBudget: number;
  locations: ActivityLocation[];
  energyLevel: EnergyLevel;
  allowedCompany: Company[];
  transportation: Transportation[];
  entropyLevel: number;
  tags: string[];
  cooldownHours: number;
  steps: string[];
  isBlind?: boolean;
}

export interface RandomizerContext {
  availableMinutes: 15 | 30 | 60 | 120 | 240;
  budgetLimit: 0 | 10 | 30 | 50 | null;
  location: 'home' | 'outside' | 'any';
  energy: EnergyLevel;
  company: Company | 'any';
  transportation: Transportation | 'any';
  entropy: number;
}

export interface RunRecord {
  id: string;
  activityId: string;
  activityTitle: string;
  category: ActivityCategory;
  seed: string;
  catalogVersion: string;
  status: RunStatus;
  generatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  abandonedAt?: string;
  estimatedMinutes: number;
  entropyLevel: number;
  budget: number;
  wasFirstSuggestion: boolean;
  rerollCount: number;
  feedback?: Feedback;
  wantMore?: boolean;
  xpEarned?: number;
}

export interface UserPreferences {
  categoryWeights: Record<ActivityCategory, number>;
  blockedActivityIds: string[];
}

export type AchievementId =
  | 'trust-the-dice'
  | 'touch-grass'
  | 'zero-budget'
  | 'jack-of-all-trades'
  | 'no-reroll'
  | 'chaos-enjoyer';

export interface PlayerProfile {
  xp: number;
  unlockedAchievements: AchievementId[];
  firstSuggestionStreak: number;
}

export interface PersistedAppState {
  filters: RandomizerContext;
  preferences: UserPreferences;
  profile: PlayerProfile;
  currentRunId?: string;
  currentStepIndex: number;
  runPhase: 'generated' | 'active' | 'feedback';
}

export interface GeneratedRun {
  activity: Activity;
  seed: string;
  weight: number;
  compatibleCount: number;
}
