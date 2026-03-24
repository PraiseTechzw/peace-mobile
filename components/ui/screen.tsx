import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { theme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  keyboardAware?: boolean;
};

export function Screen({
  children,
  scrollable = true,
  padded = true,
  keyboardAware = false,
}: ScreenProps) {
  const content = (
    <View style={[styles.content, padded && styles.padded]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <KeyboardAvoidingView style={styles.flex} behavior={keyboardAware && Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}>
            {content}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={keyboardAware && Platform.OS === 'ios' ? 'padding' : undefined}>
          {content}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: theme.spacing.x4,
  },
  content: {
    flexGrow: 1,
    gap: theme.spacing.lg,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
});
