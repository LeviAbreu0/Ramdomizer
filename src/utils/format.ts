import { ActivityCategory } from '@/types/domain';

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60}h`;
  return `${Math.floor(minutes / 60)}h${minutes % 60}`;
}

export function formatBudget(min: number, max: number): string {
  if (max === 0) return 'R$0';
  if (min === max) return `R$${max}`;
  return `R$${min}–${max}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export const categoryIcons: Record<ActivityCategory, string> = {
  Gaming: '◈',
  Music: '♫',
  Outdoor: '⌁',
  Reading: '▤',
  Learning: '◇',
  Creative: '✦',
  Cooking: '◒',
  Entertainment: '▶',
  Exploration: '⌖',
  Relaxation: '≈',
  Productive: '✓',
  Chaos: '⚡',
};
