import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { AppText } from './app-text';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="h3">{title}</AppText>
      {subtitle ? <AppText variant="caption" color={theme.colors.textSecondary}>{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.xs,
  },
});
