import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, SlideInRight, SlideOutLeft, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

const splashSteps = [
  {
    title: 'PEACE',
    tagline: 'A calm and safe place for student wellness and peer support.',
  },
  {
    title: 'CONNECT',
    tagline: 'Chat anonymously with trained peer educators who understand what you are going through.',
  },
  {
    title: 'TRACK',
    tagline: 'Monitor your mood, build healthy habits, and easily access emergency resources.',
  }
];

export default function SplashScreen() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <Screen scrollable={false}>
      <View style={styles.hero}>
        <Animated.View style={styles.orbOne} />
        <Animated.View style={styles.orbTwo} />
        
        <Animated.View 
          key={step}
          entering={FadeInRight.duration(400)} 
          exiting={FadeOutLeft.duration(400)} 
          style={styles.contentContainer}
        >
          <View style={styles.logo}>
            <AppText variant="h2" color="#FFFFFF">{splashSteps[step].title}</AppText>
          </View>
          <AppText variant="body" color="#C8DBF8" style={styles.tagline}>
            {splashSteps[step].tagline}
          </AppText>
        </Animated.View>

        <View style={styles.indicators}>
          {splashSteps.map((_, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.dot, 
                step === index ? styles.dotActive : null,
              ]} 
            />
          ))}
        </View>

        <Button onPress={handleNext}>
          {step === 2 ? 'Get Started' : 'Next'}
        </Button>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing.lg,
  },
  logo: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 280,
    fontSize: 18,
    lineHeight: 26,
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
