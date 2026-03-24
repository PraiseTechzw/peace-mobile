import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { getPeers } from '@/lib/api/peace-api';
import { theme } from '@/theme';
import type { Peer } from '@/types/app';

export default function PeerNetworkScreen() {
  const [peersList, setPeersList] = useState<Peer[]>([]);

  useEffect(() => {
    getPeers().then(setPeersList).catch(() => setPeersList([]));
  }, []);
  return (
    <Screen>
      <AppHeader title="Peer Network" subtitle="Find peer educators by focus and availability" />
      <TextField placeholder="Search by focus area or name" />
      <View style={styles.filterRow}>
        <Badge label="Anxiety" />
        <Badge label="Academic" />
        <Badge label="Relationships" />
      </View>

      <Card elevated>
        <View style={styles.row}>
          <IconBadge icon="star" tone="violet" />
          <View style={styles.grow}>
            <AppText variant="bodyStrong">Featured peer educator</AppText>
            <AppText variant="body">Tobi Brown - Anxiety, Academic stress</AppText>
          </View>
        </View>
        <Button onPress={() => router.push('/book-session')}>Book Session</Button>
      </Card>

      <View style={styles.list}>
        {peersList.map((peer) => (
          <Card key={peer.id}>
            <View style={styles.row}>
              <IconBadge icon="person" tone={peer.available ? 'mint' : 'amber'} />
              <View style={styles.grow}>
                <AppText variant="bodyStrong">{peer.name}</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {peer.rating.toFixed(1)} rating
                </AppText>
              </View>
            </View>
            <AppText variant="caption" color={theme.colors.textSecondary}>{peer.focus.join(' · ')}</AppText>
            <AppText variant="caption" color={peer.available ? theme.colors.success : theme.colors.warning}>
              {peer.available ? 'Available now' : 'Next available tomorrow'}
            </AppText>
            <Button variant="secondary" onPress={() => router.push('/book-session')}>Connect</Button>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  grow: {
    flex: 1,
  },
  list: {
    gap: theme.spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});

function Badge({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        borderWidth: 1,
        borderRadius: 999,
        minHeight: 32,
        paddingHorizontal: 12,
        justifyContent: 'center',
      }}>
      <AppText variant="caption" color={theme.colors.primaryDark}>{label}</AppText>
    </View>
  );
}
