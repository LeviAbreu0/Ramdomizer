import { storageKeys } from '@/storage/keys';
import { readJson, writeJson } from '@/storage/jsonStorage';
import { RunRecord } from '@/types/domain';
import { RunHistoryRepository } from '@/types/repositories';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncRunHistoryRepository implements RunHistoryRepository {
  async getAll(): Promise<RunRecord[]> {
    return (await readJson<RunRecord[]>(storageKeys.history)) ?? [];
  }

  async upsert(run: RunRecord): Promise<void> {
    const history = await this.getAll();
    const existingIndex = history.findIndex((item) => item.id === run.id);
    if (existingIndex >= 0) history[existingIndex] = run;
    else history.unshift(run);
    await writeJson(storageKeys.history, history);
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(storageKeys.history);
  }
}
