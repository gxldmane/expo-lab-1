import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UI_CONFIG } from "@/constants/config";

interface LocationControlProps {
  isTracking: boolean;
  onToggleTracking: () => void;
}

const LocationControl = memo<LocationControlProps>(
  ({ isTracking, onToggleTracking }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            isTracking ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={onToggleTracking}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "⏸ Остановить отслеживание" : "▶️ Начать отслеживание"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

LocationControl.displayName = "LocationControl";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: UI_CONFIG.spacing.xl,
    left: UI_CONFIG.spacing.md,
    right: UI_CONFIG.spacing.md,
    zIndex: 1000,
  },
  button: {
    paddingVertical: UI_CONFIG.spacing.md,
    paddingHorizontal: UI_CONFIG.spacing.lg,
    borderRadius: UI_CONFIG.borderRadius.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: UI_CONFIG.colors.error,
  },
  inactiveButton: {
    backgroundColor: UI_CONFIG.colors.success,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default LocationControl;
