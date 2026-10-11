/**
 * Tab Navigator Layout — Bottom tab navigation with frosted glass effect.
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeatherIcon } from '../../components/ui/FeatherIcon';
import { useTheme } from '../../constants/theme';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomInset = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 10 : 12);
  const tabBarHeight = 58 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground, 
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          borderBottomWidth: 0,
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 0,
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.05)',
        },
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Water',
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="plus-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="bell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="sliders" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
});
