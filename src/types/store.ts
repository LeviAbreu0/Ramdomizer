import {
  AchievementId,
  Activity,
  Feedback,
  PersistedAppState,
  PlayerProfile,
  RandomizerContext,
  RunRecord,
  UserPreferences,
} from './domain';

export type FilterSetter = <K extends keyof RandomizerContext>(
  key: K,
  value: RandomizerContext[K],
) => void;

export interface RandomizerStore {
  isReady: boolean;
  activities: Activity[];
  filters: RandomizerContext;
  setFilter: FilterSetter;
  history: RunRecord[];
  preferences: UserPreferences;
  profile: PlayerProfile;
  currentRun?: RunRecord;
  currentActivity?: Activity;
  runPhase: PersistedAppState['runPhase'];
  currentStepIndex: number;
  unlockedNow: AchievementId[];
  randomize: (isReroll?: boolean) => Promise<void>;
  acceptRun: () => Promise<void>;
  advanceStep: () => Promise<void>;
  completeRun: () => Promise<void>;
  abandonRun: () => Promise<void>;
  submitFeedback: (
    feedback: Feedback,
    wantMore: boolean,
    neverAgain: boolean,
  ) => Promise<void>;
  finishFeedback: () => Promise<void>;
}
