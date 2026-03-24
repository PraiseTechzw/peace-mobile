import type { ViewStyle } from 'react-native';

type ShadowKey = 'sm' | 'md' | 'lg' | 'button';
type ShadowScale = Record<ShadowKey, ViewStyle>;

export const shadows: ShadowScale = {
  sm: {
    shadowColor: '#1A3A5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A3A5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1A3A5C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#2563A8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
};
