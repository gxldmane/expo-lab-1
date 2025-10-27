import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, Dimensions, Alert} from 'react-native';
import MapView, {Marker, Region} from 'react-native-maps';
import {router} from 'expo-router';
import {MapLongPressEvent} from '@/types';
import {MAP_CONFIG, UI_CONFIG, ERROR_MESSAGES} from '@/constants/config';
import {useMarkersStore} from '@/store';

interface MapComponentProps {
    initialRegion?: Region;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    rotateEnabled?: boolean;
}

const {width, height} = Dimensions.get('window');

const MapComponent = memo<MapComponentProps>(({
                                                  initialRegion = MAP_CONFIG.INITIAL_REGION,
                                                  showsUserLocation = true,
                                                  showsMyLocationButton = true,
                                                  showsCompass = true,
                                                  rotateEnabled = true,
                                              }) => {
    // Напрямую используем store
    const markers = useMarkersStore((state) => state.markers);
    const addMarker = useMarkersStore((state) => state.addMarker);

    const handleLongPress = useCallback(async (event: MapLongPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        await addMarker({ coordinate: { latitude, longitude } });
    }, [addMarker]);

    const handleMarkerPress = useCallback((markerId: string) => {
        return () => {
            try {
                router.push(`/marker/${markerId}`);
            } catch (error) {
                console.error('Navigation error:', error);
                Alert.alert('Ошибка', ERROR_MESSAGES.NAVIGATION_FAILED);
            }
        };
    }, []);

    const renderedMarkers = useMemo(() => {
        return markers.map((marker) => (
            <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                onPress={handleMarkerPress(marker.id)}
            />
        ));
    }, [markers, handleMarkerPress]);

    return (
        <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onLongPress={handleLongPress}
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