/// <reference types="node" />
import assert from 'node:assert/strict';
import test from 'node:test';
import { activities, CATALOG_VERSION } from '@/data/activities';
import { calculateHistoryStats } from './historyStats';
import {
  addRunFeedback,
  createRunRecord,
  markRunAsAbandoned,
  markRunAsAccepted,
  markRunAsCompleted,
  replaceRunInHistory,
} from './runLifecycle';

const activity = activities[0];
const generated = {
  activity,
  seed: 'ABC-123-XY',
  weight: 1,
  compatibleCount: 10,
};

test('run lifecycle uses explicit status transitions', () => {
  const generatedRun = createRunRecord(
    generated,
    CATALOG_VERSION,
    0,
    new Date('2026-08-16T10:00:00Z'),
  );
  const acceptedRun = markRunAsAccepted(generatedRun, new Date('2026-08-16T10:01:00Z'));
  const completedRun = markRunAsCompleted(
    acceptedRun,
    activity,
    new Date('2026-08-16T10:50:00Z'),
  );
  const reviewedRun = addRunFeedback(completedRun, 'loved', true);

  assert.equal(generatedRun.status, 'generated');
  assert.equal(acceptedRun.status, 'accepted');
  assert.equal(completedRun.status, 'completed');
  assert.ok(completedRun.xpEarned && completedRun.xpEarned > 0);
  assert.equal(reviewedRun.feedback, 'loved');
  assert.equal(reviewedRun.wantMore, true);
});

test('replacing a run updates history without creating a duplicate', () => {
  const run = createRunRecord(generated, CATALOG_VERSION, 0);
  const accepted = markRunAsAccepted(run);
  const history = replaceRunInHistory([run], accepted);

  assert.equal(history.length, 1);
  assert.equal(history[0].status, 'accepted');
});

test('history statistics count completed and abandoned accepted runs', () => {
  const first = createRunRecord(generated, CATALOG_VERSION, 0);
  const completed = markRunAsCompleted(markRunAsAccepted(first), activity);

  const second = createRunRecord(generated, CATALOG_VERSION, 1);
  const abandoned = markRunAsAbandoned(markRunAsAccepted(second));

  const stats = calculateHistoryStats([completed, abandoned]);

  assert.equal(stats.completedRuns, 1);
  assert.equal(stats.acceptedRuns, 2);
  assert.equal(stats.completedMinutes, activity.estimatedMinutes);
  assert.equal(stats.favoriteCategory?.name, activity.category);
});
