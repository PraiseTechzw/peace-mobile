import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
    <Screen withMesh>
      <AppHeader title="Peer Network" subtitle="Find peer educators by focus and availability" />
      
      <View style={styles.searchContainer}>
        <TextField 
          placeholder="Search by area or name..." 
          style={styles.searchBar}
        />
        <Pressable style={styles.filterBtn}>
          <MaterialIcons name="tune" size={24} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <Badge label="All Specialists" active />
        <Badge label="Anxiety" />
        <Badge label="Academic" />
        <Badge label="Relationships" />
      </ScrollView>

      <Animated.View entering={FadeInUp}>
        <Card elevated style={styles.featuredCard}>
          <View style={styles.cardHeader}>
             <View style={styles.rewardBadge}>
                <MaterialIcons name="auto-awesome" size={16} color="#FFFFFF" />
                <AppText variant="overline" color="#FFFFFF">TOP RATED</AppText>
             </View>
             <View style={styles.statusLabel}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <AppText variant="caption" color="#D1FAE5">Online Now</AppText>
             </View>
          </View>
          
          <View style={styles.featuredBody}>
            <View style={styles.avatarLarge}>
               <MaterialIcons name="person" size={50} color={theme.colors.primary} />
            </View>
            <View style={styles.featuredText}>
              <AppText variant="h3" color="#FFFFFF">Tobi Brown</AppText>
              <AppText variant="caption" color="#D6E8FF">Anxiety · Academic Stress · Sleep</AppText>
            </View>
          </View>
          
          <Button 
            variant="secondary" 
            onPress={() => router.push('/book-session')}
            style={styles.featuredBtn}
          >
            Connect with Tobi
          </Button>
        </Card>
      </Animated.View>

      <View style={styles.sectionHeader}>
        <AppText variant="bodyStrong">Available Peers</AppText>
      </View>

      <View style={styles.list}>
        {peersList.map((peer, idx) => (
          <Animated.View key={peer.id} entering={FadeInUp.delay(100 * idx)}>
            <Pressable style={styles.peerCard} onPress={() => router.push('/book-session')}>
              <View style={styles.peerMain}>
                <View style={styles.avatarRow}>
                  <View style={styles.avatarSmall}>
                    <MaterialIcons name="person" size={24} color={theme.colors.textMuted} />
                  </View>
                  <View>
                    <AppText variant="bodyStrong">{peer.name}</AppText>
                    <View style={styles.ratingRow}>
                      <MaterialIcons name="star" size={14} color="#F59E0B" />
                      <AppText variant="caption" color={theme.colors.textMuted}>{peer.rating.toFixed(1)}</AppText>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.statusPill, { backgroundColor: peer.available ? '#D1FAE5' : '#FEF3C7' }]}>
                  <AppText variant="overline" color={peer.available ? '#059669' : '#D97706'}>
                    {peer.available ? 'AVAILABLE' : 'AWAY'}
                  </AppText>
                </View>
              </View>

              <View style={styles.focusList}>
                {peer.focus.map((f, i) => (
                  <View key={i} style={styles.focusTag}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>{f}</AppText>
                  </View>
                ))}
              </View>

              <View style={styles.peerFooter}>
                <AppText variant="caption" color={theme.colors.textMuted}>Next session: Tomorrow</AppText>
                <MaterialIcons name="arrow-forward" size={20} color={theme.colors.primary} />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  filterRow: {
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  sectionHeader: {
    marginTop: theme.spacing.sm,
  },
  featuredCard: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: '#244D78',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  statusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featuredBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredText: {
    flex: 1,
    gap: 2,
  },
  featuredBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  list: {
    gap: theme.spacing.md,
  },
  peerCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  peerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  focusList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  focusTag: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  peerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

function Badge({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <Pressable
      style={{
        backgroundColor: active ? theme.colors.primarySoft : '#FFFFFF',
        borderColor: active ? theme.colors.primary : theme.colors.border,
        borderWidth: 1,
        borderRadius: 999,
        minHeight: 36,
        paddingHorizontal: 16,
        justifyContent: 'center',
        ...theme.shadows.sm,
        marginBottom: 2,
      }}>
      <AppText variant="bodyStrong" color={active ? theme.colors.primary : theme.colors.textMuted}>{label}</AppText>
    </Pressable>
  );
}
