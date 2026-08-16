import { RandomizerContext } from '@/types/domain';

export const defaultFilters: RandomizerContext = {
  availableMinutes: 60,
  budgetLimit: 0,
  location: 'home',
  energy: 2,
  company: 'any',
  transportation: 'any',
  entropy: 50,
};
