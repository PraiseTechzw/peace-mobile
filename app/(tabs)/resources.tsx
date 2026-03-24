import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
    <Screen withMesh>
      <AppHeader title="Resources" subtitle="Browse trusted wellness and support resources" />
      
      <View style={styles.searchContainer}>
        <TextField 
          placeholder="Search articles, guides..." 
          value={query} 
          onChangeText={setQuery}
          style={styles.searchBar}
        />
        <Pressable style={styles.filterBtn}>
          <MaterialIcons name="tune" size={24} color={theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {[...new Set(['All', ...resourceCategories])].map((item) => {
          const active = item === category;
          return (
            <Pressable 
              key={item} 
              onPress={() => setCategory(item as any)}
              style={[styles.categoryTab, active && styles.categoryTabActive]}
            >
              <AppText 
                variant="bodyStrong" 
                color={active ? theme.colors.primary : theme.colors.textMuted}
              >
                {item}
              </AppText>
              {active && <View style={styles.activePill} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {filtered.length === 0 ? (
        <StateCard 
          icon="search-off"
          title="No resources found" 
          description="We couldn't find anything matching your search. Try different keywords or a different category." 
        />
      ) : (
        <View style={styles.listContainer}>
          {filtered.map((item) => (
            <Pressable key={item.id} style={styles.resourceCard}>
              <View style={[styles.resourceThumb, { backgroundColor: bgByCategory[item.category] || theme.colors.primarySoft }]}>
                 <MaterialIcons 
                   name={iconByCategory[item.category] || 'article'} 
                   size={40} 
                   color={fgByCategory[item.category] || theme.colors.primary} 
                 />
              </View>
              <View style={styles.resourceBody}>
                <View style={styles.cardHeader}>
                  <AppText variant="overline" color={fgByCategory[item.category] || theme.colors.primary}>
                    {item.category.toUpperCase()}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>{item.tag}</AppText>
                </View>
                <AppText variant="h3" style={styles.cardTitle}>{item.title}</AppText>
                <AppText variant="body" color={theme.colors.textSecondary} numberOfLines={2}>
                  {item.summary}
                </AppText>
                <View style={styles.cardFooter}>
                  <View style={styles.readTime}>
                    <MaterialIcons name="schedule" size={14} color={theme.colors.textMuted} />
                    <AppText variant="caption" color={theme.colors.textMuted}>5 min read</AppText>
                  </View>
                  <MaterialIcons name="arrow-forward" size={20} color={theme.colors.primary} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
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
  categoryScroll: {
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
  },
  categoryTab: {
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    gap: 4,
  },
  categoryTabActive: {
    // scale up logic in reanimated if wanted
  },
  activePill: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  listContainer: {
    gap: theme.spacing.lg,
  },
  resourceCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  resourceThumb: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth:1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  resourceBody: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

const iconByCategory: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Anxiety: 'self-improvement',
  Focus: 'psychology',
  Relationships: 'favorite',
  'Self-care': 'spa',
  Crisis: 'warning',
};

const bgByCategory: Record<string, string> = {
  Anxiety: '#E0F2FE',
  Focus: '#E0E7FF',
  Relationships: '#FFE4E6',
  'Self-care': '#D1FAE5',
  Crisis: '#FEF3C7',
};

const fgByCategory: Record<string, string> = {
  Anxiety: '#0284C7',
  Focus: '#4F46E5',
  Relationships: '#E11D48',
  'Self-care': '#059669',
  Crisis: '#D97706',
};

