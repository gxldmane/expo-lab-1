import React from 'react';
import { View } from 'react-native';
import MapComponent from '@/components/Map';
import ErrorHandler from '@/components/ErrorHandler';
import { useMarkersStore } from '@/store';
import { commonStyles } from '@/styles/common';

export default function HomeScreen() {
  const error = useMarkersStore((state) => state.error);
  const clearError = useMarkersStore((state) => state.clearError);

  return (
    <View style={commonStyles.container}>
      <MapComponent />
      <ErrorHandler error={error} onDismiss={clearError} />
    </View>
  );
}
