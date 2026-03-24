import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { MoodStoreProvider } from '@/store/mood-store';

export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  return (
    <MoodStoreProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crisis-help" options={{ presentation: 'modal', animation: 'fade_from_bottom' }} />
        <Stack.Screen name="book-session" />
      </Stack>
      <StatusBar style="light" />
    </MoodStoreProvider>
  );
}
