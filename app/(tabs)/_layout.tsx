import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { theme } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: theme.sizing.tabBarHeight,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="home-filled" color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="menu-book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="chat-bubble" color={color} />,
        }}
      />
      <Tabs.Screen
        name="wellness"
        options={{
          title: 'Wellness',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="monitor-heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="peers"
        options={{
          title: 'Peers',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="groups" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons size={theme.sizing.iconLg} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
