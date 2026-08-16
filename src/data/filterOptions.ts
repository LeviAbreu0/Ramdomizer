import { RandomizerContext } from '@/types/domain';

interface FilterOption<T> {
  label: string;
  value: T;
}

export const timeOptions: Array<FilterOption<RandomizerContext['availableMinutes']>> = [
  { label: '15 MIN', value: 15 },
  { label: '30 MIN', value: 30 },
  { label: '1 HORA', value: 60 },
  { label: '2 HORAS', value: 120 },
  { label: '2H+', value: 240 },
];

export const budgetOptions: Array<FilterOption<RandomizerContext['budgetLimit']>> = [
  { label: 'R$0', value: 0 },
  { label: 'ATÉ R$10', value: 10 },
  { label: 'ATÉ R$30', value: 30 },
  { label: 'ATÉ R$50', value: 50 },
  { label: 'LIVRE', value: null },
];

export const locationOptions: Array<FilterOption<RandomizerContext['location']>> = [
  { label: 'EM CASA', value: 'home' },
  { label: 'POSSO SAIR', value: 'outside' },
  { label: 'TANTO FAZ', value: 'any' },
];

export const energyOptions: Array<FilterOption<RandomizerContext['energy']>> = [
  { label: 'BAIXA', value: 1 },
  { label: 'NORMAL', value: 2 },
  { label: 'ALTA', value: 3 },
];

export const companyOptions: Array<FilterOption<RandomizerContext['company']>> = [
  { label: 'SOZINHO', value: 'alone' },
  { label: 'ACOMPANHADO', value: 'accompanied' },
  { label: 'TANTO FAZ', value: 'any' },
];

export const transportationOptions: Array<
  FilterOption<RandomizerContext['transportation']>
> = [
  { label: 'A PÉ', value: 'walk' },
  { label: 'BICICLETA', value: 'bike' },
  { label: 'VEÍCULO', value: 'vehicle' },
  { label: 'QUALQUER', value: 'any' },
];
