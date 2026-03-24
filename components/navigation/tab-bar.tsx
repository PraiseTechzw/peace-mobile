import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      <BlurView intensity={80} tint="light" style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          const iconName = options.tabBarIcon ? (options.tabBarIcon({ focused: isFocused, color: '', size: 0 }) as any).props.name : 'home';

          return (
            <Pressable
              key={route.name}
              onPress={onPress}
              style={styles.tabItem}
            >
              <TabIcon 
                name={iconName} 
                isFocused={isFocused} 
              />
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

function TabIcon({ name, isFocused }: { name: string; isFocused: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isFocused ? 1.2 : 1) }],
    backgroundColor: withSpring(isFocused ? theme.colors.primarySoft : 'transparent'),
  }));

  return (
    <Animated.View style={[styles.iconBox, animatedStyle]}>
      <MaterialIcons 
        name={name as any} 
        size={24} 
        color={isFocused ? theme.colors.primary : theme.colors.textMuted} 
      />
      {isFocused && <View style={styles.dot} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...theme.shadows.lg,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: 4,
  },
});
