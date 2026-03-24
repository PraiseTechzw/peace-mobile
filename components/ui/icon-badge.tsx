import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

type IconBadgeProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  tone?: 'blue' | 'teal' | 'mint' | 'amber' | 'rose' | 'violet';
};

const toneMap = {
  blue: { bg: '#EFF6FF', fg: '#3B82F6' },
  teal: { bg: '#CFFAFE', fg: '#0EA5C9' },
  mint: { bg: '#D1FAE5', fg: '#10B981' },
  amber: { bg: '#FEF3C7', fg: '#F59E0B' },
  rose: { bg: '#FFE4E6', fg: '#F43F5E' },
  violet: { bg: '#EDE9FE', fg: '#7C3AED' },
} as const;

export function IconBadge({ icon, tone = 'blue' }: IconBadgeProps) {
  return (
    <View style={[styles.wrap, { backgroundColor: toneMap[tone].bg }]}>
      <MaterialIcons name={icon} size={theme.sizing.iconSm} color={toneMap[tone].fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
