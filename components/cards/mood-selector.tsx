import { Pressable, StyleSheet, View } from 'react-native';

import type { Mood } from '@/types/app';
import { theme } from '@/theme';
import { AppText } from '@/components/ui/app-text';

type MoodSelectorProps = {
  value: Mood;
  onChange: (mood: Mood) => void;
};

const options: { mood: Mood; emoji: string; tone: string }[] = [
  { mood: 'Low', emoji: '😟', tone: '#F43F5E' },
  { mood: 'Okay', emoji: '🙂', tone: '#F59E0B' },
  { mood: 'Good', emoji: '😊', tone: '#0EA5C9' },
  { mood: 'Great', emoji: '😁', tone: '#10B981' },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <View style={styles.row}>
      {options.map((item) => {
        const selected = item.mood === value;
        return (
          <Pressable
            key={item.mood}
            accessibilityRole="button"
            accessibilityLabel={`Set mood to ${item.mood}`}
            onPress={() => onChange(item.mood)}
            style={({ pressed }) => [
              styles.pill,
              selected && { borderColor: item.tone, backgroundColor: '#FFFFFF' },
              pressed && styles.pressed,
            ]}>
            <AppText style={styles.emoji}>{item.emoji}</AppText>
            <AppText variant="caption" color={selected ? item.tone : theme.colors.textSecondary}>
              {item.mood}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  pill: {
    minWidth: 72,
    minHeight: 56,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    gap: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  emoji: {
    fontSize: 18,
  },
});
