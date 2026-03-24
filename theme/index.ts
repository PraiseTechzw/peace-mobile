import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { sizing } from './sizing';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  sizing,
  radius,
  typography,
  shadows,
} as const;

export type AppTheme = typeof theme;
