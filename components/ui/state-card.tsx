import { ActivityIndicator, StyleSheet } from 'react-native';

import { theme } from '@/theme';
import { AppText } from './app-text';
import { Card } from './card';

type StateCardProps = {
  title: string;
  description?: string;
  loading?: boolean;
};

export function StateCard({ title, description, loading = false }: StateCardProps) {
  return (
    <Card style={styles.card}>
      {loading ? <ActivityIndicator color={theme.colors.primary} /> : null}
      <AppText variant="bodyStrong">{title}</AppText>
      {description ? <AppText variant="caption" color={theme.colors.textSecondary}>{description}</AppText> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: theme.spacing.x2,
  },
});
