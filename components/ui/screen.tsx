import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, withSequence, interpolate } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type ReactNode, useEffect } from 'react';

import { theme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  keyboardAware?: boolean;
  withMesh?: boolean;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function Screen({
  children,
  scrollable = true,
  padded = true,
  keyboardAware = false,
  withMesh = false,
}: ScreenProps) {
  const orb1Pos = useSharedValue(0);

  useEffect(() => {
    orb1Pos.value = withRepeat(withTiming(1, { duration: 10000 }), -1, true);
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(orb1Pos.value, [0, 1], [-20, 20]) }, { translateY: interpolate(orb1Pos.value, [0, 1], [-30, 30]) }],
  }));
  const content = (
    <View style={[styles.content, padded && styles.padded]}>
      {withMesh && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[styles.orb, styles.orb1, orb1Style]} />
          <View style={[styles.orb, styles.orb2]} />
          <View style={[styles.orb, styles.orb3]} />
        </View>
      )}
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
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  orb1: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    backgroundColor: theme.colors.primary,
    top: -100,
    right: -50,
  },
  orb2: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: theme.colors.accentTeal,
    bottom: 200,
    left: -100,
  },
  orb3: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    backgroundColor: theme.colors.accentViolet,
    top: 300,
    right: -100,
  },
});
