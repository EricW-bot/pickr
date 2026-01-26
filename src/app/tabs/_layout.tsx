import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capitalCase } from 'change-case';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const tabBarWidth = screenWidth - 40;
  
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // GLOBAL LABEL LOGIC: Only show text if focused
        tabBarLabel: ({ focused, color }) => {
          if (!focused) return null;
          return (
            <Text style={[styles.label, { color }]}>
              {route.name === 'index' ? 'Battle' : capitalCase(route.name)}
            </Text>
          );
        },
        tabBarIconStyle: {
            // Centering the icon vertically when there's no label
          marginTop: 0,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 5,
          width: tabBarWidth,
          marginLeft: (screenWidth - tabBarWidth) / 2,
          borderRadius: 50,
          backgroundColor: themeColors.background,
          height: 64,
          paddingTop: 10,
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      })}>
      
      <Tabs.Screen
        name="market"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ translateY: focused ? -5 : 0 }] }}>
              <IconSymbol size={24} name="cart.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="parlay"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ translateY: focused ? -5 : 0 }] }}>
              <IconSymbol size={24} name="cards.playing" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ translateY: focused ? -5 : 0 }] }}>
              <IconSymbol size={24} name="battle" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ translateY: focused ? -5 : 0 }] }}>
              <IconSymbol size={24} name="friends" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ translateY: focused ? -5 : 0 }] }}>
              <IconSymbol size={24} name="person.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'HelveticaMedium', // Ensure font is loaded
    fontSize: 11,
    marginTop: -4,
    marginBottom: 4,
  },
});