import { Linking, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

export default function CrisisHelpScreen() {
  return (
    <Screen>
      <AppHeader title="Crisis Help" subtitle="Immediate support options when things feel unsafe." />
      <Card style={styles.hero} elevated>
        <IconBadge icon="warning" tone="rose" />
        <AppText variant="h3" color="#FFFFFF">Emergency support</AppText>
        <AppText variant="body" color="#FFE4E6">
          If you are in immediate danger, contact emergency services now.
        </AppText>
        <Button variant="danger" onPress={() => Linking.openURL('tel:112')}>Call Emergency</Button>
      </Card>

      <Card>
        <IconBadge icon="air" tone="violet" />
        <AppText variant="h3">Grounding in 60 seconds</AppText>
        <AppText variant="body" color={theme.colors.textSecondary}>
          Inhale for 4, hold for 4, exhale for 6. Repeat 5 rounds.
        </AppText>
        <Button variant="secondary" onPress={() => router.push('/breathing')}>Start Breathing</Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#7F1D1D',
    borderColor: '#B91C1C',
    gap: theme.spacing.md,
  },
});
