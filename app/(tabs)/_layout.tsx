import {Tabs} from 'expo-router';
import React, {useEffect} from 'react';
import {useMarkersStore} from '@/store';

export default function TabLayout() {
    const initialize = useMarkersStore((state) => state.initialize);
    const isInitialized = useMarkersStore((state) => state.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);

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
                }}
            />
        </Tabs>
    );
}
