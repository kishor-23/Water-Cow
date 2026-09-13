/**
 * Root Layout — Font loading, providers, and splash screen.
 */
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { HydrationProvider } from '../context/HydrationContext';
import { ThemeProvider, useTheme } from '../constants/theme';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const hide = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {}
    };

    if (fontsLoaded || fontError) {
      hide();
    }

    // Safety fallback: ensure splash screen is hidden and app is visible within 1.5s
    const timeout = setTimeout(hide, 1500);
    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  return (
    <ThemeProvider>
      <HydrationProvider>
        <AppContent />
      </HydrationProvider>
    </ThemeProvider>
  );
}

