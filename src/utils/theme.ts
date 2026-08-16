import { Platform } from 'react-native';

export const colors = {
  background: '#080B12',
  backgroundRaised: '#0C111B',
  surface: '#111824',
  surfaceHigh: '#182231',
  border: '#28364A',
  text: '#F5F8FA',
  muted: '#8D9AAE',
  accent: '#D6FF45',
  accentDark: '#9FBE28',
  violet: '#956CFF',
  cyan: '#54DCE5',
  danger: '#FF6C7A',
  warning: '#FFC95C',
  success: '#65E69D',
  black: '#05070A',
} as const;

export const fonts = {
  display: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif-condensed',
    default: 'sans-serif',
  }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
};

export const categoryColors: Record<string, string> = {
  Gaming: '#9B7BFF',
  Music: '#FF6FAE',
  Outdoor: '#67E3A3',
  Reading: '#F1C76C',
  Learning: '#6BCBFF',
  Creative: '#FF8B5D',
  Cooking: '#FFB95D',
  Entertainment: '#D17EFF',
  Exploration: '#54DCE5',
  Relaxation: '#78A5FF',
  Productive: '#A4D978',
  Chaos: '#FF6577',
};
