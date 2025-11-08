import React, { useEffect } from 'react';
import { View } from 'react-native';
import MapComponent from '@/components/Map';
import ErrorHandler from '@/components/ErrorHandler';
import { useMarkersStore } from '@/store';
import { useLocation, useProximityTracking } from '@/hooks/use-location';
import { commonStyles } from '@/styles/common';

export default function HomeScreen() {
  const error = useMarkersStore((state) => state.error);
  const clearError = useMarkersStore((state) => state.clearError);
  const markers = useMarkersStore((state) => state.markers);
    useLocation();
    const {
        startProximityTracking,
    stopProximityTracking,
  } = useProximityTracking(markers);

  useEffect(() => {
    let isActive = true;
    
    const initTracking = async () => {
      if (isActive) {
        await startProximityTracking();
      }
    };
    
    initTracking();
    
    return () => {
      isActive = false;
      stopProximityTracking();
    };
  }, [startProximityTracking, stopProximityTracking]);

  return (
    <View style={commonStyles.container}>
      <MapComponent />
      <ErrorHandler error={error} onDismiss={clearError} />
    </View>
  );
}
