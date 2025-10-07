import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
        tabBarStyle: {
          display: 'none', // Скрываем таб бар, так как у нас только одна вкладка
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'MapLab',
          tabBarIcon: ({ color }) => null, // Убираем иконку
        }}
      />
    </Tabs>
  );
}
