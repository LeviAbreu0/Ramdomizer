import { AsyncAppStateRepository } from './AsyncAppStateRepository';
import { AsyncRunHistoryRepository } from './AsyncRunHistoryRepository';
import { LocalActivityRepository } from './LocalActivityRepository';

export const activityRepository = new LocalActivityRepository();
export const runHistoryRepository = new AsyncRunHistoryRepository();
export const appStateRepository = new AsyncAppStateRepository();
