import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { theme } from '@/theme';
import { AppText } from './app-text';
import { Card } from './card';

type StateCardProps = {
  title: string;
  description?: string;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export function StateCard({ title, description, loading = false, icon = 'info-outline' }: StateCardProps) {
  return (
    <Card style={styles.card}>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="large" style={{ marginBottom: theme.spacing.md }} />
      ) : (
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={48} color={theme.colors.textMuted} />
        </View>
      )}
      <AppText variant="h3" style={{ textAlign: 'center' }}>{title}</AppText>
      {description ? (
        <AppText variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
          {description}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: theme.spacing.x3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
});
