import {
  Activity,
  GeneratedRun,
  RandomizerContext,
  RunRecord,
  UserPreferences,
} from '@/types/domain';
import { createSeed, createSeededRandom } from '@/utils/seededRandom';

const ENTROPY_RANGE = 40;
const RECENT_CATEGORY_WINDOW = 4;

export class NoCompatibleActivitiesError extends Error {
  constructor() {
    super('Nenhuma atividade é compatível com esta combinação de filtros.');
    this.name = 'NoCompatibleActivitiesError';
  }
}

interface GenerateInput {
  activities: Activity[];
  context: RandomizerContext;
  history: RunRecord[];
  preferences: UserPreferences;
  catalogVersion: string;
  seed?: string;
  now?: Date;
}

interface WeightedActivity {
  activity: Activity;
  weight: number;
}

export class RandomizerEngine {
  generate(input: GenerateInput): GeneratedRun {
    const seed = input.seed ?? createSeed();
    const now = input.now ?? new Date();
    const hardCompatible = input.activities.filter((candidate) =>
      this.isHardCompatible(candidate, input.context, input.preferences),
    );

    if (hardCompatible.length === 0) throw new NoCompatibleActivitiesError();

    const entropyCompatible = hardCompatible.filter(
      (candidate) =>
        Math.abs(candidate.entropyLevel - input.context.entropy) <= ENTROPY_RANGE,
    );
    const entropyPool = entropyCompatible.length > 0 ? entropyCompatible : hardCompatible;

    const cooldownPool = entropyPool.filter(
      (candidate) => !this.isOnCooldown(candidate, input.history, now),
    );
    // Cooldown is the only soft exclusion. It is relaxed if it would leave no valid run.
    const candidates = cooldownPool.length > 0 ? cooldownPool : entropyPool;
    const weighted = candidates.map((candidate) => ({
      activity: candidate,
      weight: this.calculateWeight(
        candidate,
        input.context,
        input.history,
        input.preferences,
      ),
    }));

    const selected = this.weightedPick(weighted, `${input.catalogVersion}:${seed}`);
    const replayableSeed = input.seed
      ? seed
      : this.createReplayableSeed(
          selected.activity,
          input.activities,
          input.catalogVersion,
          seed,
        );
    return {
      activity: selected.activity,
      seed: replayableSeed,
      weight: selected.weight,
      compatibleCount: candidates.length,
    };
  }

  /** Replays a shared seed without consulting filters, history or preferences. */
  replay(activities: Activity[], catalogVersion: string, seed: string): Activity {
    if (activities.length === 0) throw new NoCompatibleActivitiesError();
    const ordered = [...activities].sort((a, b) => a.id.localeCompare(b.id));
    const encodedIndex = /^RDX-([0-9A-Z]{3})-/i.exec(seed)?.[1];
    if (encodedIndex) return ordered[Number.parseInt(encodedIndex, 36) % ordered.length];
    const random = createSeededRandom(`${catalogVersion}:replay:${seed.toUpperCase()}`);
    return ordered[Math.floor(random() * ordered.length)];
  }

  private createReplayableSeed(
    selected: Activity,
    activities: Activity[],
    catalogVersion: string,
    initialSeed: string,
  ): string {
    const compact = initialSeed
      .replace(/[^0-9A-Z]/gi, '')
      .padEnd(6, 'R')
      .toUpperCase();
    for (let attempt = 0; attempt < 4096; attempt += 1) {
      const suffix = attempt.toString(36).toUpperCase().padStart(2, '0');
      const candidate = `${compact.slice(0, 3)}-${compact.slice(3, 6)}-${suffix}`;
      if (this.replay(activities, catalogVersion, candidate).id === selected.id)
        return candidate;
    }
    const ordered = [...activities].sort((a, b) => a.id.localeCompare(b.id));
    const index = ordered.findIndex((activity) => activity.id === selected.id);
    return `RDX-${Math.max(0, index).toString(36).toUpperCase().padStart(3, '0')}-00`;
  }

  private isHardCompatible(
    activity: Activity,
    context: RandomizerContext,
    preferences: UserPreferences,
  ): boolean {
    if (preferences.blockedActivityIds.includes(activity.id)) return false;
    if (activity.estimatedMinutes > context.availableMinutes) return false;
    if (context.budgetLimit !== null && activity.maxBudget > context.budgetLimit)
      return false;
    if (activity.energyLevel > context.energy) return false;
    if (context.company !== 'any' && !activity.allowedCompany.includes(context.company))
      return false;
    if (context.location === 'home' && !activity.locations.includes('home')) return false;
    if (
      context.location === 'outside' &&
      !activity.locations.some(
        (location) => location === 'outside' || location === 'public',
      )
    )
      return false;
    if (
      context.location !== 'home' &&
      context.transportation !== 'any' &&
      !activity.transportation.includes('none') &&
      !activity.transportation.includes(context.transportation)
    )
      return false;
    return true;
  }

  private isOnCooldown(activity: Activity, history: RunRecord[], now: Date): boolean {
    const latest = history
      .filter((run) => run.activityId === activity.id)
      .sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt))[0];
    if (!latest) return false;
    const elapsedHours = (now.getTime() - Date.parse(latest.generatedAt)) / 3_600_000;
    return elapsedHours < activity.cooldownHours;
  }

  private calculateWeight(
    activity: Activity,
    context: RandomizerContext,
    history: RunRecord[],
    preferences: UserPreferences,
  ): number {
    const preferenceWeight = preferences.categoryWeights[activity.category] ?? 1;
    const entropyDistance = Math.abs(activity.entropyLevel - context.entropy);
    const entropyWeight = 0.35 + 1.15 * Math.exp(-(entropyDistance ** 2) / (2 * 24 ** 2));

    const recentCategories = [...history]
      .filter((run) => run.status === 'completed' || run.status === 'accepted')
      .sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt))
      .slice(0, RECENT_CATEGORY_WINDOW)
      .map((run) => run.category);
    const repetitions = recentCategories.filter(
      (category) => category === activity.category,
    ).length;
    const diversityWeight = [1.18, 0.66, 0.28, 0.1, 0.06][repetitions] ?? 0.05;

    const exactEnergyBonus = activity.energyLevel === context.energy ? 1.08 : 1;
    const blindRunBonus = activity.isBlind && context.entropy >= 75 ? 1.22 : 1;
    return Math.max(
      0.01,
      preferenceWeight *
        entropyWeight *
        diversityWeight *
        exactEnergyBonus *
        blindRunBonus,
    );
  }

  private weightedPick(items: WeightedActivity[], seed: string): WeightedActivity {
    const random = createSeededRandom(seed);
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let cursor = random() * total;
    for (const item of items) {
      cursor -= item.weight;
      if (cursor <= 0) return item;
    }
    return items[items.length - 1];
  }
}
