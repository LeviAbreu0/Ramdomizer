import { RunRecord } from '@/types/domain';

export interface HistoryStats {
  acceptedRuns: number;
  completedRuns: number;
  completedMinutes: number;
  favoriteCategory?: {
    name: string;
    count: number;
  };
}

export function calculateHistoryStats(history: RunRecord[]): HistoryStats {
  const completedRuns = history.filter((run) => run.status === 'completed');
  const acceptedRuns = history.filter((run) =>
    ['accepted', 'completed', 'abandoned'].includes(run.status),
  );

  const completedMinutes = completedRuns.reduce(
    (total, run) => total + run.estimatedMinutes,
    0,
  );

  const categoryCounts = completedRuns.reduce<Record<string, number>>((counts, run) => {
    counts[run.category] = (counts[run.category] ?? 0) + 1;
    return counts;
  }, {});

  const favoriteEntry = Object.entries(categoryCounts).sort(
    ([, countA], [, countB]) => countB - countA,
  )[0];

  return {
    acceptedRuns: acceptedRuns.length,
    completedRuns: completedRuns.length,
    completedMinutes,
    favoriteCategory: favoriteEntry
      ? { name: favoriteEntry[0], count: favoriteEntry[1] }
      : undefined,
  };
}
