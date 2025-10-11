import React, { useCallback } from 'react';
import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import MapComponent from '@/components/Map';
import ErrorHandler from '@/components/ErrorHandler';
import { useMarkers } from '@/hooks/use-markers';
import { MapMarker, MapLongPressEvent } from '@/types';
import { ERROR_MESSAGES } from '@/constants/config';
import { commonStyles } from '@/styles/common';

export default function HomeScreen() {
  const { markers, error, addMarker, clearError } = useMarkers();

  const handleLongPress = useCallback(async (event: MapLongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    await addMarker({ latitude, longitude });
  }, [addMarker]);

  const handleMarkerPress = useCallback((marker: MapMarker) => {
    try {
      router.push(`/marker/${marker.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Ошибка', ERROR_MESSAGES.NAVIGATION_FAILED);
    }
  }, []);

  return (
    <View style={commonStyles.container}>
      <MapComponent
        markers={markers}
        onLongPress={handleLongPress}
        onMarkerPress={handleMarkerPress}
      />
      <ErrorHandler error={error} onDismiss={clearError} />
    </View>
  );
}
