import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LocationState } from "@/types";
import { UI_CONFIG } from "@/constants/config";

interface LocationInfoProps {
  locationState: LocationState;
}

const LocationInfo = memo<LocationInfoProps>(({ locationState }) => {
  const { location, errorMsg } = locationState;

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <View style={[styles.badge, styles.errorBadge]}>
          <Text style={styles.errorText}>📍 Ошибка: {errorMsg}</Text>
        </View>
      </View>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.coordsText}>
          📍 {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
        </Text>
        {location.coords.accuracy && (
          <Text style={styles.accuracyText}>
            Точность: ±{Math.round(location.coords.accuracy)} м
          </Text>
        )}
      </View>
    </View>
  );
});

LocationInfo.displayName = "LocationInfo";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: UI_CONFIG.spacing.md,
    left: UI_CONFIG.spacing.md,
    right: UI_CONFIG.spacing.md,
    zIndex: 1000,
  },
  badge: {
    padding: UI_CONFIG.spacing.sm,
    borderRadius: UI_CONFIG.borderRadius.md,
    backgroundColor: UI_CONFIG.colors.surface,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorBadge: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  coordsText: {
    fontSize: 12,
    color: UI_CONFIG.colors.textSecondary,
  },
  accuracyText: {
    fontSize: 11,
    color: UI_CONFIG.colors.textSecondary,
    marginTop: UI_CONFIG.spacing.xs,
  },
  errorText: {
    fontSize: 14,
    color: UI_CONFIG.colors.error,
  },
});

export default LocationInfo;
