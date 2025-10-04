import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MapMarker, MapLongPressEvent } from '@/types';
import { MAP_CONFIG, UI_CONFIG } from '@/constants/config';

interface MapComponentProps {
  readonly markers: readonly MapMarker[];
  onLongPress: (event: MapLongPressEvent) => void;
  onMarkerPress: (marker: MapMarker) => void;
  initialRegion?: Region;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  showsCompass?: boolean;
  rotateEnabled?: boolean;
}

const { width, height } = Dimensions.get('window');

const MapComponent = memo<MapComponentProps>(({ 
  markers, 
  onLongPress, 
  onMarkerPress,
  initialRegion = MAP_CONFIG.INITIAL_REGION,
  showsUserLocation = true,
  showsMyLocationButton = true,
  showsCompass = true,
  rotateEnabled = true,
}) => {

  const handleMarkerPress = useCallback((marker: MapMarker) => {
    return () => onMarkerPress(marker);
  }, [onMarkerPress]);

  const renderedMarkers = useMemo(() => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        coordinate={marker.coordinate}
        title={marker.title}
        description={marker.description}
        onPress={handleMarkerPress(marker)}
      />
    ));
  }, [markers, handleMarkerPress]);

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      onLongPress={onLongPress}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsMyLocationButton}
      showsCompass={showsCompass}
      rotateEnabled={rotateEnabled}
      showsTraffic={false}
      showsIndoors={false}
      loadingEnabled
      loadingIndicatorColor={UI_CONFIG.colors.primary}
      loadingBackgroundColor={UI_CONFIG.colors.surface}
    >
      {renderedMarkers}
    </MapView>
  );
});

MapComponent.displayName = 'MapComponent';

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
});

export default MapComponent;