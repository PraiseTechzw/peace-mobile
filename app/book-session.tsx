import { useEffect, useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { createBooking, getOpenSlots, type BookingSlotResponse } from '@/lib/api/peace-api';
import { theme } from '@/theme';

const slots = ['8:00 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
const sessionTypes: { label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { label: 'Video', icon: 'videocam' },
  { label: 'Voice', icon: 'call' },
  { label: 'Chat', icon: 'chat-bubble-outline' },
];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const monthDates = Array.from({ length: 28 }, (_, index) => index + 1);

export default function BookSessionScreen() {
  const [date, setDate] = useState(24);
  const [slot, setSlot] = useState('11:30 AM');
  const [sessionType, setSessionType] = useState('Video');
  const [apiSlots, setApiSlots] = useState<BookingSlotResponse[]>([]);

  useEffect(() => {
    getOpenSlots().then(setApiSlots).catch(() => setApiSlots([]));
  }, []);

  const displaySlots = useMemo(() => {
    if (apiSlots.length === 0) {
      return slots;
    }
    return apiSlots.map((item) =>
      new Date(item.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    );
  }, [apiSlots]);

  const slotLookup = useMemo(() => {
    const map = new Map<string, BookingSlotResponse>();
    for (const item of apiSlots) {
      const key = new Date(item.startsAt).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
      map.set(key, item);
    }
    return map;
  }, [apiSlots]);

  const onConfirmBooking = async () => {
    try {
      const selected = slotLookup.get(slot);
      if (!selected) {
        Alert.alert('No backend slot', 'This selected time has no server slot mapping.');
        return;
      }

      await createBooking({
        peerEducatorId: selected.peerEducatorId,
        slotId: selected.id,
        sessionType: mapSessionType(sessionType),
      });
      Alert.alert('Booked', 'Session booking was created successfully.');
    } catch {
      Alert.alert('Booking failed', 'Unable to create booking. Please verify API and auth token.');
    }
  };

  return (
    <Screen>
      <AppHeader title="Book a Session" subtitle="Schedule with a peer educator" />

      <Card elevated style={styles.peerCard}>
        <View style={styles.peerTop}>
          <IconBadge icon="person" tone="violet" />
          <View style={styles.peerMeta}>
            <AppText variant="bodyStrong">Chido Mutasa</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>Peer Educator • Mental Health</AppText>
            <AppText variant="caption" color="#F59E0B">★★★★★ 4.9 • 32 sessions</AppText>
          </View>
        </View>
      </Card>

      <View style={styles.group}>
        <AppText variant="bodyStrong">Pick a date</AppText>
        <Card style={styles.calendarCard}>
          <View style={styles.weekHeader}>
            {weekDays.map((item) => (
              <AppText key={item} variant="caption" color={theme.colors.textMuted}>{item}</AppText>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {monthDates.map((day) => {
              const selected = day === date;
              return (
                <Pressable
                  key={day}
                  onPress={() => setDate(day)}
                  style={[styles.dateCell, selected && styles.dateCellSelected]}>
                  <AppText variant="caption" color={selected ? '#FFFFFF' : theme.colors.primary}>
                    {day}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>

      <View style={styles.group}>
        <AppText variant="bodyStrong">Pick a time - Tue {date} Mar</AppText>
        <View style={styles.row}>
          {displaySlots.map((item) => {
            const selected = item === slot;
            const disabled = item === '2:30 PM';

            return (
              <Pressable
                key={item}
                disabled={disabled}
                onPress={() => setSlot(item)}
                style={[styles.slotPill, selected && styles.slotPillSelected, disabled && styles.slotPillDisabled]}>
                <AppText
                  variant="bodyStrong"
                  color={disabled ? '#A4B4C8' : selected ? theme.colors.primary : theme.colors.textSecondary}>
                  {item}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <AppText variant="bodyStrong">Session type</AppText>
        <View style={styles.sessionRow}>
          {sessionTypes.map((item) => {
            const selected = item.label === sessionType;
            return (
              <Pressable key={item.label} onPress={() => setSessionType(item.label)} style={[styles.sessionCard, selected && styles.sessionCardSelected]}>
                <MaterialIcons
                  name={item.icon}
                  size={theme.sizing.iconSm}
                  color={selected ? theme.colors.primary : theme.colors.textMuted}
                />
                <AppText variant="bodyStrong" color={selected ? theme.colors.primary : theme.colors.textSecondary}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Card style={styles.confirmWrap}>
        <Button onPress={onConfirmBooking}>Confirm Booking</Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  peerCard: {
    backgroundColor: '#F7FAFF',
  },
  peerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  peerMeta: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  group: {
    gap: theme.spacing.sm,
  },
  calendarCard: {
    paddingVertical: theme.spacing.md,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  dateCell: {
    width: '13%',
    minHeight: 30,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F8FF',
  },
  dateCellSelected: {
    backgroundColor: theme.colors.primary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  slotPill: {
    minHeight: 42,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
  },
  slotPillSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EAF2FF',
  },
  slotPillDisabled: {
    backgroundColor: '#EDF2F8',
    borderColor: '#DFE8F3',
  },
  sessionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sessionCard: {
    flex: 1,
    minHeight: 54,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  sessionCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EAF2FF',
  },
  confirmWrap: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

function mapSessionType(value: string): 'chat' | 'voice' | 'video' | 'in_person' {
  if (value === 'Voice') return 'voice';
  if (value === 'Chat') return 'chat';
  return 'video';
}
