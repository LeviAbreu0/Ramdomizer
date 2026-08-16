import { AchievementId } from '@/types/domain';

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
}

export const achievements: AchievementDefinition[] = [
  {
    id: 'trust-the-dice',
    title: 'TRUST THE DICE',
    description: 'Aceite a primeira sugestão 10 vezes.',
  },
  {
    id: 'touch-grass',
    title: 'TOUCH GRASS',
    description: 'Complete 10 atividades Outdoor.',
  },
  {
    id: 'zero-budget',
    title: 'ZERO BUDGET',
    description: 'Complete 20 atividades de R$0.',
  },
  {
    id: 'jack-of-all-trades',
    title: 'JACK OF ALL TRADES',
    description: 'Complete atividades de 10 categorias diferentes.',
  },
  {
    id: 'no-reroll',
    title: 'NO REROLL',
    description: 'Complete 5 primeiras sugestões consecutivas.',
  },
  {
    id: 'chaos-enjoyer',
    title: 'CHAOS ENJOYER',
    description: 'Complete 10 runs com entropia alta.',
  },
];
