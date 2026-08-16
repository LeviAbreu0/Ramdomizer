import { activities, CATALOG_VERSION } from '@/data/activities';
import { Activity } from '@/types/domain';
import { ActivityRepository } from '@/types/repositories';

export class LocalActivityRepository implements ActivityRepository {
  async getAll(): Promise<Activity[]> {
    return activities;
  }

  async getById(id: string): Promise<Activity | undefined> {
    return activities.find((activity) => activity.id === id);
  }

  getCatalogVersion(): string {
    return CATALOG_VERSION;
  }
}
