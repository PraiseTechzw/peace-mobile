import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { router } from 'expo-router';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { getProfile, updateProfile, type ProfileResponse } from '@/lib/api/peace-api';
import { theme } from '@/theme';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => {
        // Fallback for development/UI
        setProfile({
          id: 'dev-1',
          name: 'Prais A.',
          checkInsCount: 12,
          sessionsCount: 4,
          resourcesCount: 18,
          notificationsEnabled: true,
          anonymousMode: true,
        });
      });
  }, []);

  const toggleNotifications = async (val: boolean) => {
    if (!profile) return;
    setProfile({ ...profile, notificationsEnabled: val });
    try {
      await updateProfile({ notificationsEnabled: val });
    } catch {
      // Revert on fail
      setProfile({ ...profile, notificationsEnabled: !val });
    }
  };

  const toggleAnonymousMode = async (val: boolean) => {
    if (!profile) return;
    setProfile({ ...profile, anonymousMode: val });
    try {
      await updateProfile({ anonymousMode: val });
    } catch {
      // Revert on fail
      setProfile({ ...profile, anonymousMode: !val });
    }
  };

  if (!profile) {
    return (
      <Screen>
        <AppHeader title="Profile & Settings" subtitle="Loading..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Profile & Settings" subtitle="Manage your preferences and account" />
      <Card elevated>
        <View style={styles.userTop}>
          <IconBadge icon="person" tone="blue" />
          <View>
            <AppText variant="h2">{profile.name}</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>{profile.checkInsCount} check-ins • {profile.sessionsCount} sessions completed</AppText>
          </View>
        </View>
        <View style={styles.stats}>
          <Stat label="Mood logs" value={profile.checkInsCount.toString()} />
          <Stat label="Sessions" value={profile.sessionsCount.toString()} />
          <Stat label="Resources" value={profile.resourcesCount.toString()} />
        </View>
      </Card>

      <Card>
        <AppText variant="caption" color={theme.colors.textMuted}>PREFERENCES</AppText>
        <Row label="Push notifications" right={<Switch value={profile.notificationsEnabled} onValueChange={toggleNotifications} trackColor={{ false: '#CBD8E6', true: '#93C5FD' }} />} />
        <Row label="Anonymous peer chat" right={<Switch value={profile.anonymousMode} onValueChange={toggleAnonymousMode} trackColor={{ false: '#CBD8E6', true: '#93C5FD' }} />} />
      </Card>

      <Card>
        <AppText variant="caption" color={theme.colors.textMuted}>ACCOUNT</AppText>
        <Pressable style={styles.row} onPress={() => router.push('/edit-profile')}><AppText>Edit profile</AppText><AppText color={theme.colors.textMuted}>›</AppText></Pressable>
        <Pressable style={styles.row} onPress={() => router.push('/privacy-settings')}><AppText>Privacy settings</AppText><AppText color={theme.colors.textMuted}>›</AppText></Pressable>
        <Pressable style={styles.row}><AppText color={theme.colors.danger}>Logout</AppText><AppText color={theme.colors.danger}>›</AppText></Pressable>
      </Card>
    </Screen>
  );
}

function Row({ label, right }: { label: string; right: ReactNode }) {
  return (
    <View style={styles.row}>
      <AppText>{label}</AppText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  row: {
    minHeight: theme.sizing.controlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <AppText variant="bodyStrong">{value}</AppText>
      <AppText variant="caption" color={theme.colors.textMuted}>{label}</AppText>
    </View>
  );
}
