import { calculateRunXp } from './progression';
import { Activity, Feedback, GeneratedRun, RunRecord } from '@/types/domain';
import { createId } from '@/utils/seededRandom';

export function createRunRecord(
  generated: GeneratedRun,
  catalogVersion: string,
  rerollCount: number,
  now = new Date(),
): RunRecord {
  const activity = generated.activity;

  return {
    id: createId('run'),
    activityId: activity.id,
    activityTitle: activity.title,
    category: activity.category,
    seed: generated.seed,
    catalogVersion,
    status: 'generated',
    generatedAt: now.toISOString(),
    estimatedMinutes: activity.estimatedMinutes,
    entropyLevel: activity.entropyLevel,
    budget: activity.maxBudget,
    wasFirstSuggestion: rerollCount === 0,
    rerollCount,
  };
}

export function markRunAsRerolled(run: RunRecord): RunRecord {
  return { ...run, status: 'rerolled' };
}

export function markRunAsAccepted(run: RunRecord, now = new Date()): RunRecord {
  return {
    ...run,
    status: 'accepted',
    acceptedAt: now.toISOString(),
  };
}

export function markRunAsCompleted(
  run: RunRecord,
  activity: Activity,
  now = new Date(),
): RunRecord {
  return {
    ...run,
    status: 'completed',
    completedAt: now.toISOString(),
    xpEarned: calculateRunXp(activity),
  };
}

export function markRunAsAbandoned(run: RunRecord, now = new Date()): RunRecord {
  return {
    ...run,
    status: 'abandoned',
    abandonedAt: now.toISOString(),
  };
}

export function addRunFeedback(
  run: RunRecord,
  feedback: Feedback,
  wantMore: boolean,
): RunRecord {
  return { ...run, feedback, wantMore };
}

export function replaceRunInHistory(
  history: RunRecord[],
  updatedRun: RunRecord,
): RunRecord[] {
  const exists = history.some((run) => run.id === updatedRun.id);

  if (!exists) return [updatedRun, ...history];

  return history.map((run) => (run.id === updatedRun.id ? updatedRun : run));
}
