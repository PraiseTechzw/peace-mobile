import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, ScrollView, Image } from 'react-native';

import { MoodSelector } from '@/components/cards/mood-selector';
import { AppHeader } from '@/components/ui/app-header';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { useMoodStore } from '@/store/mood-store';
import { theme } from '@/theme';
import { getProfile, getResources, type ProfileResponse } from '@/lib/api/peace-api';
import type { Resource } from '@/types/app';

export default function HomeScreen() {
  const { mood, setMood, updatedAt } = useMoodStore();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
    getResources().then(res => setResources(res.slice(0, 5))).catch(() => {});
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Screen withMesh>
      <AppHeader 
        eyebrow={greeting()} 
        title={profile ? `Hey ${profile.name.split(' ')[0]}!` : 'Hey there!'} 
        trailing={
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={24} color={theme.colors.primary} />
            </View>
          </Pressable>
        }
      />

      <Card elevated style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <AppText variant="caption" color="#D6E8FF">Recommended for you</AppText>
            <AppText variant="h3" color="#FFFFFF">Mindful Moments</AppText>
            <AppText variant="body" color="#E9F3FF" style={{ marginTop: 4 }}>
              Take 2 minutes to center yourself with a breathing session.
            </AppText>
          </View>
          <View style={styles.heroAction}>
            <MaterialIcons name="air" size={32} color="#FFFFFF" />
          </View>
        </View>
        <Button 
          variant="secondary" 
          onPress={() => router.push('/breathing')}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}
        >
          Start Session
        </Button>
      </Card>

      <View style={styles.sectionHeader}>
        <AppText variant="bodyStrong">Quick Support</AppText>
      </View>

      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <Pressable key={action.title} style={styles.quickCard} onPress={action.onPress}>
            <IconBadge icon={action.icon} tone={action.tone} size={48} />
            <AppText variant="bodyStrong" style={{ marginTop: 8 }}>{action.title}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <AppText variant="bodyStrong">Daily Tools</AppText>
        <Pressable onPress={() => router.push('/(tabs)/wellness')}>
          <AppText variant="caption" color={theme.colors.primary}>View all</AppText>
        </Pressable>
      </View>

      <Card elevated style={styles.moodCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="bodyStrong">How are you feeling?</AppText>
          {updatedAt && <IconBadge icon="check-circle" tone="mint" size={24} />}
        </View>
        <MoodSelector value={mood} onChange={setMood} />
      </Card>

      <View style={styles.sectionHeader}>
        <AppText variant="bodyStrong">Top Resources</AppText>
        <Pressable onPress={() => router.push('/(tabs)/resources')}>
          <AppText variant="caption" color={theme.colors.primary}>View all</AppText>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {resources.map((res) => (
          <Pressable key={res.id} style={styles.resourceCard} onPress={() => router.push('/(tabs)/resources')}>
            <View style={styles.resourceThumb}>
               <MaterialIcons name="article" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.resourceInfo}>
              <AppText variant="caption" color={theme.colors.primary}>{res.category}</AppText>
              <AppText variant="bodyStrong" numberOfLines={1}>{res.title}</AppText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Card style={styles.crisis}>
        <View style={styles.crisisRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3" color="#FFFFFF">In Crisis?</AppText>
            <AppText variant="caption" color="#FFE4E6">Immediate help available 24/7</AppText>
          </View>
          <Button 
            variant="danger" 
            onPress={() => router.push('/crisis-help')}
            style={{ paddingHorizontal: theme.spacing.xl }}
          >
            Help
          </Button>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  heroCard: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: '#244D78',
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  heroAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  moodCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: '#BFDBFE',
    gap: theme.spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  quickCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  horizontalScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  resourceCard: {
    width: 200,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  resourceThumb: {
    height: 90,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceInfo: {
    padding: theme.spacing.sm,
    gap: 2,
  },
  crisis: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
    marginTop: theme.spacing.md,
  },
  crisisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
});

const quickActions: {
  title: string;
  tone: 'blue' | 'teal' | 'mint' | 'amber' | 'rose' | 'violet';
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}[] = [
  { title: 'Resources', tone: 'blue', icon: 'menu-book', onPress: () => router.push('/(tabs)/resources') },
  { title: 'Chat', tone: 'teal', icon: 'chat-bubble', onPress: () => router.push('/(tabs)/chat') },
  { title: 'Peers', tone: 'amber', icon: 'groups', onPress: () => router.push('/(tabs)/peers') },
];
