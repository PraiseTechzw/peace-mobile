import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

export default function SplashScreen() {
  return (
    <Screen scrollable={false}>
      <View style={styles.hero}>
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        <View style={styles.logo}>
          <AppText variant="h2" color="#FFFFFF">PEACE</AppText>
        </View>
        <AppText variant="body" color="#C8DBF8" style={styles.tagline}>
          A calm and safe place for student wellness and peer support.
        </AppText>
        <View style={styles.indicators}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Button onPress={() => router.replace('/onboarding')}>Get Started</Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    margin: theme.spacing.lg,
    backgroundColor: '#1A3A5C',
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.x3,
    gap: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  orbOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(59,130,246,0.25)',
    top: -40,
    right: -40,
  },
  orbTwo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(14,165,201,0.2)',
    bottom: 20,
    left: -20,
  },
  logo: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 280,
  },
  indicators: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 20,
    borderRadius: theme.radius.pill,
    backgroundColor: '#FFFFFF',
  },
});
