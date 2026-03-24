import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, SlideInRight, SlideOutLeft, Layout } from 'react-native-reanimated';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

const topics = ['Exam stress', 'Anxiety', 'Relationships', 'Sleep', 'Confidence', 'Crisis planning'];
const goals = ['Daily check-ins', 'Talk to a peer', 'Track my mood', 'Get better sleep'];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Exam stress']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => (prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic]));
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((x) => x !== goal) : [...prev, goal]));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen>
      <View style={styles.progress}>
        <Animated.View 
          layout={Layout.springify()} 
          style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} 
        />
      </View>

      {step === 1 ? (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
          <AppHeader
            eyebrow="Step 1 of 2"
            title="Set up your support profile"
            subtitle="Pick topics you want support with. You can stay anonymous in peer chat."
          />

          <View style={styles.chips}>
            {topics.map((topic) => (
              <Chip key={topic} label={topic} selected={selectedTopics.includes(topic)} onPress={() => toggleTopic(topic)} />
            ))}
          </View>

          <View style={styles.notice}>
            <View style={styles.noticeRow}>
              <IconBadge icon="lock" tone="blue" />
              <View style={styles.noticeContent}>
                <AppText variant="bodyStrong">Privacy note</AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Your details are private. You control what is shared with peer educators.
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>
      ) : (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContainer}>
          <AppHeader
            eyebrow="Step 2 of 2"
            title="What are your goals?"
            subtitle="Select a few goals to personalize your daily prompts."
          />

          <View style={styles.chips}>
            {goals.map((goal) => (
              <Chip key={goal} label={goal} selected={selectedGoals.includes(goal)} onPress={() => toggleGoal(goal)} />
            ))}
          </View>

          <View style={[styles.notice, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <View style={styles.noticeRow}>
              <IconBadge icon="notifications-active" tone="mint" />
              <View style={styles.noticeContent}>
                <AppText variant="bodyStrong">Enable reminders</AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  We'll gently remind you to check-in based on your chosen goals.
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      <Animated.View layout={Layout.springify()} style={{ marginTop: 'auto' }}>
        <Button onPress={handleNext}>{step === 1 ? 'Continue' : 'Finish Setup'}</Button>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: '#E3EDFA',
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  progressFill: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  stepContainer: {
    gap: theme.spacing.md,
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  notice: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  noticeContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
