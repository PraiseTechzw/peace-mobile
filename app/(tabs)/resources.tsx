import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { StateCard } from '@/components/ui/state-card';
import { TextField } from '@/components/ui/text-field';
import { resourceCategories } from '@/data/mock';
import { getResources } from '@/lib/api/peace-api';
import { theme } from '@/theme';
import type { Resource } from '@/types/app';

export default function ResourcesScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof resourceCategories)[number]>('All');
  const [resourcesList, setResourcesList] = useState<Resource[]>([]);

  useEffect(() => {
    getResources().then(setResourcesList).catch(() => setResourcesList([]));
  }, []);

  const filtered = useMemo(
    () =>
      resourcesList.filter((item) => {
        const categoryMatch = category === 'All' || item.category === category;
        const queryMatch = item.title.toLowerCase().includes(query.toLowerCase());
        return categoryMatch && queryMatch;
      }),
    [category, query, resourcesList]
  );

  return (
    <Screen>
      <AppHeader title="Resources" subtitle="Browse trusted wellness and support resources" />
      <Card elevated style={styles.heroCard}>
        <View style={styles.heroRow}>
          <IconBadge icon="library-books" tone="blue" />
          <View style={styles.title}>
            <AppText variant="bodyStrong">Curated for students</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              Short, practical resources you can use right away.
            </AppText>
          </View>
        </View>
      </Card>
      <TextField placeholder="Search resources" value={query} onChangeText={setQuery} />

      <View style={styles.chips}>
        {resourceCategories.map((item) => (
          <Chip key={item} label={item} selected={item === category} onPress={() => setCategory(item)} />
        ))}
      </View>

      {filtered.length === 0 ? (
        <StateCard title="No resources found" description="Try another keyword or category." />
      ) : (
        <FlatList
          data={filtered}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <IconBadge icon={iconByCategory[item.category]} tone={toneByCategory[item.category]} />
                <AppText variant="bodyStrong" style={styles.title}>{item.title}</AppText>
              </View>
              <AppText variant="body" color={theme.colors.textSecondary}>{item.summary}</AppText>
              <View style={styles.metaRow}>
                <AppText variant="caption" color={theme.colors.primary}>{item.tag}</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>{item.category}</AppText>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#F7FAFF',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const iconByCategory = {
  Anxiety: 'self-improvement',
  Focus: 'psychology',
  Relationships: 'favorite',
  'Self-care': 'spa',
  Crisis: 'warning',
} as const;

const toneByCategory = {
  Anxiety: 'teal',
  Focus: 'blue',
  Relationships: 'rose',
  'Self-care': 'mint',
  Crisis: 'amber',
} as const;
