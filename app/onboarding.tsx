import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, SlideInRight, SlideOutLeft, Layout } from 'react-native-reanimated';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { theme } from '@/theme';

const topics = [
  { id: 't1', label: 'Exam stress', icon: 'auto-stories' as const },
  { id: 't2', label: 'Anxiety', icon: 'waves' as const },
  { id: 't3', label: 'Relationships', icon: 'favorite-border' as const },
  { id: 't4', label: 'Sleep', icon: 'bedtime' as const },
  { id: 't5', label: 'Confidence', icon: 'emoji-events' as const },
  { id: 't6', label: 'Crisis planning', icon: 'health-and-safety' as const },
];
const goals = [
  { id: 'g1', label: 'Daily check-ins', icon: 'fact-check' as const },
  { id: 'g2', label: 'Talk to a peer', icon: 'forum' as const },
  { id: 'g3', label: 'Track my mood', icon: 'mood' as const },
  { id: 'g4', label: 'Get better sleep', icon: 'bedtime' as const },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['t1']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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

          <View style={styles.grid}>
            {topics.map((t) => {
              const active = selectedTopics.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => toggleTopic(t.id)}
                  style={[styles.tile, active && styles.tileActive]}>
                  <MaterialIcons name={t.icon} size={28} color={active ? theme.colors.primary : theme.colors.textMuted} />
                  <AppText variant="bodyStrong" color={active ? theme.colors.primaryDark : theme.colors.textSecondary} style={{ textAlign: 'center' }}>
                    {t.label}
                  </AppText>
                </Pressable>
              );
            })}
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

          <View style={styles.gridList}>
            {goals.map((g) => {
              const active = selectedGoals.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  onPress={() => toggleGoal(g.id)}
                  style={[styles.listTile, active && styles.tileActive]}>
                  <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                    <MaterialIcons name={g.icon} size={24} color={active ? theme.colors.primaryDark : theme.colors.textMuted} />
                  </View>
                  <AppText variant="bodyStrong" color={active ? theme.colors.primaryDark : theme.colors.textSecondary}>
                    {g.label}
                  </AppText>
                  <MaterialIcons 
                    name={active ? 'check-circle' : 'radio-button-unchecked'} 
                    size={24} 
                    color={active ? theme.colors.primary : theme.colors.border} 
                    style={{ marginLeft: 'auto' }}
                  />
                </Pressable>
              );
            })}
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
    gap: theme.spacing.lg,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  tile: {
    width: '47%',
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  tileActive: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
  },
  gridList: {
    gap: theme.spacing.md,
  },
  listTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconWrapActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
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
