import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { defaultFilters } from '@/data/defaultState';
import { RandomizerEngine } from '@/domain/RandomizerEngine';
import {
  applyFeedback,
  blockActivity,
  createDefaultPreferences,
} from '@/domain/preferences';
import { completeProfile, createDefaultProfile } from '@/domain/progression';
import {
  addRunFeedback,
  createRunRecord,
  markRunAsAbandoned,
  markRunAsAccepted,
  markRunAsCompleted,
  markRunAsRerolled,
  replaceRunInHistory,
} from '@/domain/runLifecycle';
import {
  appStateRepository,
  activityRepository,
  runHistoryRepository,
} from '@/services/repositories';
import {
  AchievementId,
  Activity,
  Feedback,
  PersistedAppState,
  PlayerProfile,
  RandomizerContext,
  RunRecord,
  UserPreferences,
} from '@/types/domain';
import { FilterSetter, RandomizerStore } from '@/types/store';

const RandomizerContextStore = createContext<RandomizerStore | null>(null);
const engine = new RandomizerEngine();

export function RandomizerProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<RandomizerContext>(defaultFilters);
  const [history, setHistory] = useState<RunRecord[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(
    createDefaultPreferences,
  );
  const [profile, setProfile] = useState<PlayerProfile>(createDefaultProfile);
  const [currentRunId, setCurrentRunId] = useState<string>();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [runPhase, setRunPhase] = useState<PersistedAppState['runPhase']>('generated');
  const [unlockedNow, setUnlockedNow] = useState<AchievementId[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      activityRepository.getAll(),
      runHistoryRepository.getAll(),
      appStateRepository.load(),
    ])
      .then(([catalog, storedHistory, stored]) => {
        if (!mounted) return;
        const defaultPreferences = createDefaultPreferences();
        setActivities(catalog);
        setHistory(storedHistory);
        if (stored) {
          setFilters({ ...defaultFilters, ...stored.filters });
          setPreferences({
            categoryWeights: {
              ...defaultPreferences.categoryWeights,
              ...stored.preferences?.categoryWeights,
            },
            blockedActivityIds: stored.preferences?.blockedActivityIds ?? [],
          });
          setProfile({ ...createDefaultProfile(), ...stored.profile });
          setCurrentRunId(stored.currentRunId);
          setCurrentStepIndex(stored.currentStepIndex ?? 0);
          setRunPhase(stored.runPhase ?? 'generated');
        }
        setIsReady(true);
      })
      .catch((error) => {
        console.error('[Randomizer] Failed to load local state.', error);
        setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const currentRun = history.find((run) => run.id === currentRunId);
  const currentActivity = activities.find(
    (activity) => activity.id === currentRun?.activityId,
  );

  const snapshot = (
    overrides: Partial<PersistedAppState> = {},
    nextFilters = filters,
    nextPreferences = preferences,
    nextProfile = profile,
  ): PersistedAppState => ({
    filters: nextFilters,
    preferences: nextPreferences,
    profile: nextProfile,
    currentRunId,
    currentStepIndex,
    runPhase,
    ...overrides,
  });

  const setFilter: FilterSetter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    void appStateRepository.save(snapshot({}, next));
  };

  const randomize = async (isReroll = false) => {
    let sourceHistory = history;
    let rerollCount = 0;
    if (isReroll && currentRun) {
      const rerolled = markRunAsRerolled(currentRun);
      sourceHistory = replaceRunInHistory(sourceHistory, rerolled);
      rerollCount = currentRun.rerollCount + 1;
      setHistory(sourceHistory);
      await runHistoryRepository.upsert(rerolled);
    }

    const generated = engine.generate({
      activities,
      context: filters,
      history: sourceHistory,
      preferences,
      catalogVersion: activityRepository.getCatalogVersion(),
    });
    const run = createRunRecord(
      generated,
      activityRepository.getCatalogVersion(),
      rerollCount,
    );
    const nextHistory = [run, ...sourceHistory];
    setHistory(nextHistory);
    setCurrentRunId(run.id);
    setCurrentStepIndex(0);
    setRunPhase('generated');
    setUnlockedNow([]);
    await Promise.all([
      runHistoryRepository.upsert(run),
      appStateRepository.save(
        snapshot({ currentRunId: run.id, currentStepIndex: 0, runPhase: 'generated' }),
      ),
    ]);
  };

  const acceptRun = async () => {
    if (!currentRun) return;
    const accepted = markRunAsAccepted(currentRun);
    const nextHistory = replaceRunInHistory(history, accepted);
    setHistory(nextHistory);
    setRunPhase('active');
    await Promise.all([
      runHistoryRepository.upsert(accepted),
      appStateRepository.save(snapshot({ runPhase: 'active' })),
    ]);
  };

  const advanceStep = async () => {
    const next = currentStepIndex + 1;
    setCurrentStepIndex(next);
    await appStateRepository.save(snapshot({ currentStepIndex: next }));
  };

  const completeRun = async () => {
    if (!currentRun || !currentActivity) return;
    const completed = markRunAsCompleted(currentRun, currentActivity);
    const nextHistory = replaceRunInHistory(history, completed);
    const progression = completeProfile(profile, completed, nextHistory);
    setHistory(nextHistory);
    setProfile(progression.profile);
    setUnlockedNow(progression.unlockedNow);
    setRunPhase('feedback');
    await Promise.all([
      runHistoryRepository.upsert(completed),
      appStateRepository.save(
        snapshot({ runPhase: 'feedback' }, filters, preferences, progression.profile),
      ),
    ]);
  };

  const abandonRun = async () => {
    if (!currentRun) return;
    const abandoned = markRunAsAbandoned(currentRun);
    const nextHistory = replaceRunInHistory(history, abandoned);
    setHistory(nextHistory);
    setCurrentRunId(undefined);
    setCurrentStepIndex(0);
    setRunPhase('generated');
    await Promise.all([
      runHistoryRepository.upsert(abandoned),
      appStateRepository.save(
        snapshot({ currentRunId: undefined, currentStepIndex: 0, runPhase: 'generated' }),
      ),
    ]);
  };

  const submitFeedback = async (
    feedback: Feedback,
    wantMore: boolean,
    neverAgain: boolean,
  ) => {
    if (!currentRun || !currentActivity) return;
    let nextPreferences = applyFeedback(
      preferences,
      currentActivity.id,
      currentActivity.category,
      feedback,
      wantMore,
    );
    if (neverAgain) nextPreferences = blockActivity(nextPreferences, currentActivity.id);
    const reviewed = addRunFeedback(currentRun, feedback, wantMore);
    const nextHistory = replaceRunInHistory(history, reviewed);
    setPreferences(nextPreferences);
    setHistory(nextHistory);
    await Promise.all([
      runHistoryRepository.upsert(reviewed),
      appStateRepository.save(snapshot({}, filters, nextPreferences)),
    ]);
  };

  const finishFeedback = async () => {
    setCurrentRunId(undefined);
    setCurrentStepIndex(0);
    setRunPhase('generated');
    setUnlockedNow([]);
    await appStateRepository.save(
      snapshot({ currentRunId: undefined, currentStepIndex: 0, runPhase: 'generated' }),
    );
  };

  const value: RandomizerStore = {
    isReady,
    activities,
    filters,
    setFilter,
    history,
    preferences,
    profile,
    currentRun,
    currentActivity,
    runPhase,
    currentStepIndex,
    unlockedNow,
    randomize,
    acceptRun,
    advanceStep,
    completeRun,
    abandonRun,
    submitFeedback,
    finishFeedback,
  };

  return (
    <RandomizerContextStore.Provider value={value}>
      {children}
    </RandomizerContextStore.Provider>
  );
}

export function useRandomizer(): RandomizerStore {
  const value = useContext(RandomizerContextStore);
  if (!value) throw new Error('useRandomizer must be used inside RandomizerProvider');
  return value;
}
