import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: {
          fontFamily: 'HelveticaMedium',
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 25,
          borderRadius: 30,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          paddingBottom: 6,
          paddingTop: 6,
          marginLeft: 16,
          marginRight: 16,
          height: 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="parlay"
        options={{
          title: 'Parlay',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cards.playing" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Battle',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="battle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="friends" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}