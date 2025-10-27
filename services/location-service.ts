import * as Location from "expo-location";
import { LocationConfig } from "@/types";
import { LOCATION_CONFIG } from "@/constants/config";

let locationSubscription: Location.LocationSubscription | null = null;
let isWatching = false;

async function requestPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Доступ к местоположению не разрешён");
    }
    return true;
  } catch (error) {
    console.error("Error requesting location permissions:", error);
    throw error;
  }
}

async function checkPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking location permissions:", error);
    return false;
  }
}

async function getCurrentLocation(): Promise<Location.LocationObject> {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      await requestPermissions();
    }

    return await Location.getCurrentPositionAsync({
      accuracy: LOCATION_CONFIG.ACCURACY,
    });
  } catch (error) {
    console.error("Error getting current location:", error);
    throw error;
  }
}

async function startLocationUpdates(
  onLocation: (location: Location.LocationObject) => void,
  config: LocationConfig = {
    accuracy: LOCATION_CONFIG.ACCURACY,
    timeInterval: LOCATION_CONFIG.TIME_INTERVAL,
    distanceInterval: LOCATION_CONFIG.DISTANCE_INTERVAL,
  }
): Promise<void> {
  try {
    if (isWatching) {
      console.warn("Location updates already started");
      return;
    }

    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      await requestPermissions();
    }

    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: config.accuracy,
        timeInterval: config.timeInterval,
        distanceInterval: config.distanceInterval,
      },
      (location) => {
        onLocation(location);
      }
    );

    isWatching = true;
    console.log("Location updates started");
  } catch (error) {
    console.error("Error starting location updates:", error);
    throw error;
  }
}

async function stopLocationUpdates(): Promise<void> {
  try {
    if (locationSubscription) {
      locationSubscription.remove();
      locationSubscription = null;
      isWatching = false;
      console.log("Location updates stopped");
    }
  } catch (error) {
    console.error("Error stopping location updates:", error);
    throw error;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const locationService = {
  requestPermissions,
  checkPermissions,
  getCurrentLocation,
  startLocationUpdates,
  stopLocationUpdates,
} as const;
