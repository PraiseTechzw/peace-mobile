import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

export default function BreathingScreen() {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  
  // Animation value goes 0 (inhale) -> 1 (hold) -> 2 (exhale) -> 0
  const progress = useSharedValue(0);

  useEffect(() => {
    // 4s inhale, 4s hold, 6s exhale
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withDelay(4000, withTiming(2, { duration: 6000, easing: Easing.inOut(Easing.ease) })),
        withTiming(0, { duration: 0 }) // reset
      ),
      -1,
      false
    );

    const interval = setInterval(() => {
      const p = progress.value;
      if (p < 1) setPhase('Inhale');
      else if (p < 2 && p >= 1) {
        // approximate the hold phase based on time
        // Actually, tracking phase via shared value can be tricky in JS layer,
        // let's just do a rough timer for text.
      }
    }, 100);

    let phaseTimer1: ReturnType<typeof setTimeout>;
    let phaseTimer2: ReturnType<typeof setTimeout>;
    
    const cycle = () => {
      setPhase('Inhale');
      phaseTimer1 = setTimeout(() => setPhase('Hold'), 4000);
      phaseTimer2 = setTimeout(() => setPhase('Exhale'), 8000);
    };
    
    cycle();
    const mainInterval = setInterval(cycle, 14000);

    return () => {
      clearInterval(interval);
      clearInterval(mainInterval);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
    };
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = progress.value < 1 
      ? 1 + progress.value * 0.5 // scale up to 1.5
      : progress.value < 2 
        ? 1.5 // hold at 1.5
        : 1.5 - ((progress.value - 1) * 0.5); // scale down to 1

    const bgColor = interpolateColor(
      progress.value < 1 ? progress.value : progress.value < 2 ? 1 : 2 - (progress.value - 1),
      [0, 1],
      ['rgba(14, 165, 201, 0.1)', 'rgba(16, 185, 129, 0.5)']
    );

    return {
      transform: [{ scale }],
      backgroundColor: bgColor,
    };
  });

  return (
    <Screen>
      <AppHeader title="Breathing Exercise" subtitle="Ground yourself in 60 seconds" showBack />
      
      <View style={styles.container}>
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, animatedStyle]} />
          <View style={styles.innerCircle}>
            <AppText variant="h2" color={theme.colors.primaryDark}>
              {phase}
            </AppText>
          </View>
        </View>

        <View style={styles.instructions}>
          <AppText variant="bodyStrong" style={{ textAlign: 'center' }}>
            Follow the circle
          </AppText>
          <AppText variant="body" color={theme.colors.textSecondary} style={{ textAlign: 'center' }}>
            Inhale for 4 seconds, hold for 4, exhale for 6.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  innerCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  instructions: {
    marginTop: 60,
    gap: theme.spacing.sm,
  },
});
