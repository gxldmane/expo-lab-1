import {Tabs} from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                headerShown: false,
                tabBarStyle: {
                    display: 'none'
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'MapLab',
                    tabBarIcon: ({color}) => null,
                }}
            />
        </Tabs>
    );
}
