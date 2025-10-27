import { useState, useEffect, useCallback, useRef } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import {
  locationService,
  calculateDistance,
} from "@/services/location-service";
import { notificationManager } from "@/services/notification-manager";
import { LocationState, MapMarker, ProximityCheckResult } from "@/types";
import { LOCATION_CONFIG } from "@/constants/config";

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    errorMsg: null,
    isTracking: false,
  });

  const requestPermissions = useCallback(async () => {
    try {
      await locationService.requestPermissions();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось получить разрешение";
      setLocationState((prev) => ({
        ...prev,
        errorMsg: errorMessage,
      }));
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setLocationState((prev) => ({
        ...prev,
        location,
        errorMsg: null,
      }));
      return location;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось получить местоположение";
      setLocationState((prev) => ({
        ...prev,
        errorMsg: errorMessage,
      }));
      return null;
    }
  }, []);

  const startTracking = useCallback(
    async (onLocationUpdate?: (location: Location.LocationObject) => void) => {
      try {
        await locationService.startLocationUpdates((location) => {
          setLocationState((prev) => ({
            ...prev,
            location,
            errorMsg: null,
            isTracking: true,
          }));
          onLocationUpdate?.(location);
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Не удалось начать отслеживание";
        setLocationState((prev) => ({
          ...prev,
          errorMsg: errorMessage,
          isTracking: false,
        }));
      }
    },
    []
  );

  const stopTracking = useCallback(async () => {
    try {
      await locationService.stopLocationUpdates();
      setLocationState((prev) => ({
        ...prev,
        isTracking: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Не удалось остановить отслеживание";
      setLocationState((prev) => ({
        ...prev,
        errorMsg: errorMessage,
      }));
    }
  }, []);

  return {
    ...locationState,
    requestPermissions,
    getCurrentLocation,
    startTracking,
    stopTracking,
  } as const;
}

export function useProximityTracking(markers: readonly MapMarker[]) {
  const { location, startTracking, stopTracking, isTracking, errorMsg } =
    useLocation();
  const [proximityResults, setProximityResults] = useState<
    ProximityCheckResult[]
  >([]);
  const markersRef = useRef(markers);
  const permissionDeniedShown = useRef(false);

  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const checkProximity = useCallback(
    (userLocation: Location.LocationObject) => {
      if (!userLocation) {
        console.log("⚠️ No user location provided to checkProximity");
        return;
      }

      const results: ProximityCheckResult[] = [];
      const currentMarkers = markersRef.current;

      console.log(`📍 Checking proximity for ${currentMarkers.length} markers`);

      currentMarkers.forEach((marker) => {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          marker.coordinate.latitude,
          marker.coordinate.longitude
        );

        const isInRange = distance <= LOCATION_CONFIG.PROXIMITY_THRESHOLD;

        results.push({
          markerId: marker.id,
          distance,
          isInRange,
        });

        console.log(
          `📌 Marker ${marker.id} (${marker.title}): ${Math.round(
            distance
          )}m - ${isInRange ? "IN RANGE ✅" : "out of range"}`
        );

        if (isInRange) {
          notificationManager.showNotification(marker, distance);
        } else {
          notificationManager.markAsOutOfRange(marker.id);
        }
      });

      setProximityResults(results);
    },
    []
  );

  const startProximityTracking = useCallback(async () => {
    try {
      const hasPermission = await locationService.checkPermissions();

      if (!hasPermission) {
        try {
          await locationService.requestPermissions();
          permissionDeniedShown.current = false;
        } catch (error) {
          if (!permissionDeniedShown.current) {
            permissionDeniedShown.current = true;
            Alert.alert(
              "Отслеживание меток невозможно",
              "Для отслеживания близости к меткам необходимо предоставить доступ к местоположению",
              [{ text: "OK" }],
              { cancelable: true }
            );
          }
          throw error;
        }
      } else {
        permissionDeniedShown.current = false;
      }

      await notificationManager.initialize();
      await startTracking(checkProximity);
    } catch (error) {
      console.error("Error starting proximity tracking:", error);
    }
  }, [startTracking, checkProximity]);

  const stopProximityTracking = useCallback(async () => {
    await stopTracking();
    await notificationManager.clearAllNotifications();
  }, [stopTracking]);

  return {
    location,
    isTracking,
    errorMsg,
    proximityResults,
    startProximityTracking,
    stopProximityTracking,
  } as const;
}
