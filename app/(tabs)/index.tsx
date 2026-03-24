import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { MoodSelector } from '@/components/cards/mood-selector';
import { AppHeader } from '@/components/ui/app-header';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { useMoodStore } from '@/store/mood-store';
import { theme } from '@/theme';

export default function HomeScreen() {
  const { mood, setMood, updatedAt } = useMoodStore();

  return (
    <Screen>
      <AppHeader eyebrow="Welcome back" title="Hey Prais, how are you today?" />

      <Card elevated style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View>
            <AppText variant="caption" color="#D6E8FF">Today&apos;s focus</AppText>
            <AppText variant="h3" color="#FFFFFF">Small wins matter.</AppText>
          </View>
          <MaterialIcons name="auto-awesome" size={theme.sizing.iconLg} color="#CFFAFE" />
        </View>
        <AppText variant="body" color="#E9F3FF">
          Track one mood check-in and connect with one peer educator.
        </AppText>
      </Card>

      <Card elevated style={styles.moodCard}>
        <AppText variant="bodyStrong">Mood check-in</AppText>
        <MoodSelector value={mood} onChange={setMood} />
        <AppText variant="caption" color={theme.colors.textSecondary}>
          {updatedAt
            ? `Logged as ${mood} just now.`
            : 'How you feel now shapes your support suggestions.'}
        </AppText>
      </Card>

      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <Pressable key={action.title} style={styles.quickCard} onPress={action.onPress}>
            <View style={styles.quickTop}>
              <IconBadge icon={action.icon} tone={action.tone} />
              <MaterialIcons name="chevron-right" size={theme.sizing.iconMd} color={theme.colors.textMuted} />
            </View>
            <AppText variant="bodyStrong">{action.title}</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>{action.description}</AppText>
          </Pressable>
        ))}
      </View>

      <Card style={styles.crisis}>
        <AppText variant="h3" color="#FFFFFF">Need urgent support?</AppText>
        <AppText variant="body" color="#FFFFFF">Immediate support options are available right now.</AppText>
        <Button variant="danger" onPress={() => router.push('/crisis-help')}>Open Crisis Help</Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: '#244D78',
    gap: theme.spacing.sm,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodCard: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: '#BFDBFE',
    gap: theme.spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  quickTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  crisis: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
    gap: theme.spacing.md,
  },
});

const quickActions: {
  title: string;
  description: string;
  tone: 'blue' | 'teal' | 'mint' | 'amber' | 'rose' | 'violet';
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}[] = [
  { title: 'Resources', description: 'Guides, toolkits, and quick reads', tone: 'blue', icon: 'menu-book', onPress: () => router.push('/(tabs)/resources') },
  { title: 'Chat', description: 'Talk with trained peer educators', tone: 'teal', icon: 'chat-bubble', onPress: () => router.push('/(tabs)/chat') },
  { title: 'Wellness', description: 'Track mood and habits weekly', tone: 'mint', icon: 'monitor-heart', onPress: () => router.push('/(tabs)/wellness') },
  { title: 'Peer Network', description: 'Find support by focus area', tone: 'amber', icon: 'groups', onPress: () => router.push('/(tabs)/peers') },
];
