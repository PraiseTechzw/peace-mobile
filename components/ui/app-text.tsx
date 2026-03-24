import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { theme } from '@/theme';

type Variant = keyof typeof theme.typography;

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
};

export function AppText({ variant = 'body', color = theme.colors.textPrimary, style, ...rest }: AppTextProps) {
  return <Text style={[theme.typography[variant], { color }, style]} {...rest} />;
}
