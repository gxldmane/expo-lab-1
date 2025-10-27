import React from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useDatabase } from '@/hooks/use-database';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useDatabase();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="marker/[id]" options={{headerShown: false}}/>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
