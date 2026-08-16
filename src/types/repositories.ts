import { Activity, PersistedAppState, RunRecord } from './domain';

export interface ActivityRepository {
  getAll(): Promise<Activity[]>;
  getById(id: string): Promise<Activity | undefined>;
  getCatalogVersion(): string;
}

export interface RunHistoryRepository {
  getAll(): Promise<RunRecord[]>;
  upsert(run: RunRecord): Promise<void>;
  clear(): Promise<void>;
}

export interface AppStateRepository {
  load(): Promise<PersistedAppState | null>;
  save(state: PersistedAppState): Promise<void>;
}
