import { storageKeys } from '@/storage/keys';
import { readJson, writeJson } from '@/storage/jsonStorage';
import { PersistedAppState } from '@/types/domain';
import { AppStateRepository } from '@/types/repositories';

export class AsyncAppStateRepository implements AppStateRepository {
  private pendingWrite: Promise<void> = Promise.resolve();

  load(): Promise<PersistedAppState | null> {
    return readJson<PersistedAppState>(storageKeys.appState);
  }

  save(state: PersistedAppState): Promise<void> {
    // Slider updates can be very fast; serializing writes guarantees the newest snapshot wins.
    this.pendingWrite = this.pendingWrite
      .catch(() => undefined)
      .then(() => writeJson(storageKeys.appState, state));
    return this.pendingWrite;
  }
}
