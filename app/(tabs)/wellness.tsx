import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { MoodSelector } from '@/components/cards/mood-selector';
import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { moodWeek } from '@/data/mock';
import { createMoodEntry, getMoodHistory, type MoodEntryResponse } from '@/lib/api/peace-api';
import { useMoodStore } from '@/store/mood-store';
import { theme } from '@/theme';
import type { Mood } from '@/types/app';

export default function WellnessScreen() {
  const { mood, setMood } = useMoodStore();
  const [history, setHistory] = useState<MoodEntryResponse[]>([]);

  useEffect(() => {
    getMoodHistory().then(setHistory).catch(() => setHistory([]));
  }, []);

  const weeklyData = useMemo(() => {
    if (history.length === 0) {
      return moodWeek;
    }

    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const byDay = new Map<string, number>();
    for (const entry of history.slice(0, 7)) {
      const day = labels[new Date(entry.recordedAt).getDay()];
      byDay.set(day, entry.moodScore);
    }
    return labels.map((day) => ({ day, mood: byDay.get(day) ?? 0 }));
  }, [history]);

  const bestDay = weeklyData.reduce((best, day) => (day.mood > best.mood ? day : best), weeklyData[0]);
  const loggedDays = weeklyData.filter((day) => day.mood > 0).length;

  const onLogCheckIn = async () => {
    try {
      await createMoodEntry({ moodScore: moodToScore(mood) });
      const refreshed = await getMoodHistory();
      setHistory(refreshed);
      Alert.alert('Logged', 'Your check-in has been saved.');
    } catch {
      Alert.alert('Failed', 'Unable to save check-in. Please verify API and auth token.');
    }
  };

  return (
    <Screen>
      <AppHeader title="Wellness Tracker" subtitle="Track mood patterns and progress this week" />
      <Card elevated style={styles.insight}>
        <AppText variant="bodyStrong" color="#FFFFFF">Weekly insight</AppText>
        <AppText variant="caption" color="#DCEBFF">
          You feel better on days with at least one check-in. Keep the streak going.
        </AppText>
      </Card>
      <Card elevated style={styles.calendarCard}>
        <View style={styles.calendarTop}>
          <View>
            <AppText variant="bodyStrong">This week</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {loggedDays}/7 days logged • Best day: {bestDay.day}
            </AppText>
          </View>
          <View style={styles.streakPill}>
            <AppText variant="caption" color={theme.colors.primaryDark}>3 day streak</AppText>
          </View>
        </View>

        <View style={styles.weekRow}>
          {weeklyData.map((day, index) => (
            <View
              key={day.day}
              style={[
                styles.dayCard,
                day.mood > 0 ? styles.dayCardLogged : styles.dayCardIdle,
                index === 6 && styles.todayCard,
              ]}>
              <AppText variant="caption" color={theme.colors.textMuted}>{day.day}</AppText>
              <AppText variant="bodyStrong">{weekDates[index]}</AppText>
              <View style={[styles.dot, moodTone(day.mood)]} />
            </View>
          ))}
        </View>

        <View style={styles.legendRow}>
          <Legend label="Low" color="#F43F5E" />
          <Legend label="Okay" color="#F59E0B" />
          <Legend label="Good" color="#0EA5C9" />
          <Legend label="Great" color="#10B981" />
        </View>
      </Card>

      <Card elevated>
        <AppText variant="bodyStrong">How are you feeling now?</AppText>
        <MoodSelector value={mood} onChange={setMood} />
        <AppText variant="caption" color={theme.colors.textSecondary}>
          Current mood: {mood}. This helps tailor check-ins and peer recommendations.
        </AppText>
      </Card>

      <Card elevated>
        <AppText variant="bodyStrong">Progress</AppText>
        <ProgressRow label="Check-ins completed" value="11" progress={0.72} tone="mint" />
        <ProgressRow label="Sleep consistency" value="73%" progress={0.73} tone="teal" />
        <ProgressRow label="Stress trend" value="Improving" progress={0.66} tone="amber" />
      </Card>

      <Button onPress={onLogCheckIn}>Log Today&apos;s Check-in</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: '#F7FAFF',
  },
  calendarTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakPill: {
    backgroundColor: '#E0ECFF',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    minHeight: 28,
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
  },
  dayCardLogged: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFE0F5',
  },
  dayCardIdle: {
    backgroundColor: '#EEF3FA',
    borderColor: '#DCE6F3',
  },
  todayCard: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  insight: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: '#2A5687',
  },
  metric: {
    gap: theme.spacing.xs,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: '#E6EEF9',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: theme.radius.pill,
  },
});

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <AppText variant="caption" color={theme.colors.textMuted}>{label}</AppText>
    </View>
  );
}

function ProgressRow({
  label,
  value,
  progress,
  tone,
}: {
  label: string;
  value: string;
  progress: number;
  tone: 'mint' | 'teal' | 'amber';
}) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricTop}>
        <AppText>{label}</AppText>
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.max(0, Math.min(100, progress * 100))}%`, backgroundColor: toneColor[tone] },
          ]}
        />
      </View>
    </View>
  );
}

const toneColor = {
  mint: '#10B981',
  teal: '#0EA5C9',
  amber: '#F59E0B',
} as const;

const weekDates = ['12', '13', '14', '15', '16', '17', '18'] as const;

function moodToScore(value: Mood): number {
  if (value === 'Low') return 1;
  if (value === 'Okay') return 2;
  if (value === 'Good') return 3;
  return 4;
}

function moodTone(value: number) {
  if (value <= 0) {
    return { backgroundColor: '#CBD9EA' };
  }
  if (value === 1) {
    return { backgroundColor: '#F43F5E' };
  }
  if (value === 2) {
    return { backgroundColor: '#F59E0B' };
  }
  if (value === 3) {
    return { backgroundColor: '#0EA5C9' };
  }
  return { backgroundColor: '#10B981' };
}
