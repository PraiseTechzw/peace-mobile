import { StyleSheet, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { theme } from '@/theme';
import { AppText } from './app-text';

type AppHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function AppHeader({ eyebrow, title, subtitle, showBack }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
      )}
      <View style={styles.wrap}>
        {eyebrow ? <AppText variant="overline" color={theme.colors.textSecondary}>{eyebrow}</AppText> : null}
        <AppText variant="h1">{title}</AppText>
        {subtitle ? <AppText variant="body" color={theme.colors.textSecondary}>{subtitle}</AppText> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.md,
  },
  backBtn: {
    paddingTop: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
