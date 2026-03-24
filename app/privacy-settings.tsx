import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';
import { View, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';

export default function PrivacySettingsScreen() {
  const [shareData, setShareData] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <Screen>
      <AppHeader title="Privacy Settings" subtitle="Control your data & visibility" showBack />
      
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <AppText variant="bodyStrong">Share aggregated mood data</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>Help us understand generalized student trends.</AppText>
          </View>
          <Switch value={shareData} onValueChange={setShareData} trackColor={{ false: '#CBD8E6', true: '#93C5FD' }} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <AppText variant="bodyStrong">App Analytics</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>Allow anonymous crash reporting.</AppText>
          </View>
          <Switch value={analytics} onValueChange={setAnalytics} trackColor={{ false: '#CBD8E6', true: '#93C5FD' }} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xs,
  },
});
