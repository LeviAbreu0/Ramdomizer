/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { activities, CATALOG_VERSION } from '@/data/activities';
import { createDefaultPreferences } from './preferences';
import { NoCompatibleActivitiesError, RandomizerEngine } from './RandomizerEngine';
import { activityCategories, RandomizerContext, RunRecord } from '@/types/domain';

const engine = new RandomizerEngine();
const getActivity = (id: string) => {
  const found = activities.find((item) => item.id === id);
  if (!found) throw new Error(`Missing fixture: ${id}`);
  return found;
};
const context: RandomizerContext = {
  availableMinutes: 60,
  budgetLimit: 0,
  location: 'home',
  energy: 2,
  company: 'any',
  transportation: 'any',
  entropy: 50,
};

test('catalog has 60 valid, unique and balanced activities', () => {
  assert.equal(activities.length, 60);
  assert.equal(new Set(activities.map((item) => item.id)).size, activities.length);
  for (const category of activityCategories) {
    assert.equal(activities.filter((item) => item.category === category).length, 5);
  }
  for (const item of activities) {
    assert.ok(item.estimatedMinutes > 0);
    assert.ok(item.minBudget >= 0 && item.maxBudget >= item.minBudget);
    assert.ok(item.entropyLevel >= 0 && item.entropyLevel <= 100);
    assert.ok(item.locations.length > 0 && item.allowedCompany.length > 0);
    if (item.isBlind) assert.ok(item.steps.length >= 2);
  }
});

test('the same seed and inputs reproduce the same activity', () => {
  const input = {
    activities,
    context,
    history: [],
    preferences: createDefaultPreferences(),
    catalogVersion: CATALOG_VERSION,
    seed: 'R7K-244-XA',
    now: new Date('2026-08-16T12:00:00Z'),
  };
  assert.equal(engine.generate(input).activity.id, engine.generate(input).activity.id);
});

test('a generated share seed replays the same run using only catalog version', () => {
  const generated = engine.generate({
    activities,
    context,
    history: [],
    preferences: createDefaultPreferences(),
    catalogVersion: CATALOG_VERSION,
  });
  const replayed = engine.replay(activities, CATALOG_VERSION, generated.seed);
  assert.equal(replayed.id, generated.activity.id);
});

test('hard filters never exceed time, budget, location or energy', () => {
  const strictContext: RandomizerContext = {
    ...context,
    availableMinutes: 15,
    energy: 1,
    entropy: 15,
  };
  const result = engine.generate({
    activities,
    context: strictContext,
    history: [],
    preferences: createDefaultPreferences(),
    catalogVersion: CATALOG_VERSION,
    seed: 'SAFE-001',
  }).activity;
  assert.ok(result.estimatedMinutes <= 15);
  assert.equal(result.maxBudget, 0);
  assert.ok(result.locations.includes('home'));
  assert.ok(result.energyLevel <= 1);
});

test('a blocked activity is excluded even when it is the strongest candidate', () => {
  const target = getActivity('music-unknown-album');
  const fallback = getActivity('learning-object-anatomy');
  const preferences = createDefaultPreferences();
  preferences.blockedActivityIds = [target.id];
  const result = engine.generate({
    activities: [target, fallback],
    context,
    history: [],
    preferences,
    catalogVersion: CATALOG_VERSION,
    seed: 'BLOCK-001',
  });
  assert.equal(result.activity.id, fallback.id);
});

test('cooldown removes a recent suggestion while another candidate exists', () => {
  const recentActivity = getActivity('music-unknown-album');
  const availableActivity = getActivity('learning-object-anatomy');
  const recentRun: RunRecord = {
    id: 'recent',
    activityId: recentActivity.id,
    activityTitle: recentActivity.title,
    category: recentActivity.category,
    seed: 'OLD',
    catalogVersion: CATALOG_VERSION,
    status: 'completed',
    generatedAt: '2026-08-16T11:00:00Z',
    completedAt: '2026-08-16T11:30:00Z',
    estimatedMinutes: recentActivity.estimatedMinutes,
    entropyLevel: recentActivity.entropyLevel,
    budget: recentActivity.maxBudget,
    wasFirstSuggestion: true,
    rerollCount: 0,
  };
  const result = engine.generate({
    activities: [recentActivity, availableActivity],
    context,
    history: [recentRun],
    preferences: createDefaultPreferences(),
    catalogVersion: CATALOG_VERSION,
    seed: 'COOL-001',
    now: new Date('2026-08-16T12:00:00Z'),
  });
  assert.equal(result.activity.id, availableActivity.id);
});

test('impossible hard filters fail explicitly', () => {
  const preferences = createDefaultPreferences();
  preferences.blockedActivityIds = activities.map((item) => item.id);
  assert.throws(
    () =>
      engine.generate({
        activities,
        context,
        history: [],
        preferences,
        catalogVersion: CATALOG_VERSION,
        seed: 'NONE-001',
      }),
    NoCompatibleActivitiesError,
  );
});
