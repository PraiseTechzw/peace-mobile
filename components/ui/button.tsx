import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { AppText } from './app-text';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  accessibilityLabel?: string;
}>;

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <View>
        <AppText variant="bodyStrong" color={textColors[variant]}>
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: theme.sizing.controlHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.xl,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.button,
  },
  secondary: {
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
});

const textColors = {
  primary: '#FFFFFF',
  secondary: theme.colors.primaryDark,
  danger: '#FFFFFF',
} as const;
