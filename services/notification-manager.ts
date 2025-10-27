import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationContent, MapMarker } from "@/types";
import { NOTIFICATION_CONFIG } from "@/constants/config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const markerStates = new Map<string, boolean>();
let isInitialized = false;
const processingNotifications = new Set<string>();

async function initialize(): Promise<void> {
  try {
    if (isInitialized) {
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error("Разрешение на уведомления не предоставлено");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CONFIG.CHANNEL_ID,
        {
          name: NOTIFICATION_CONFIG.CHANNEL_NAME,
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        }
      );
    }

    isInitialized = true;
    console.log("Notification manager initialized");
  } catch (error) {
    console.error("Error initializing notification manager:", error);
    throw error;
  }
}

async function showNotification(
  marker: MapMarker,
  distance: number
): Promise<void> {
  if (processingNotifications.has(marker.id)) {
    console.log(`⏳ Already processing notification for marker ${marker.id}`);
    return;
  }

  processingNotifications.add(marker.id);

  try {
    if (!isInitialized) {
      await initialize();
    }

    const wasInRange = markerStates.get(marker.id);

    console.log(
      `🔍 Marker ${marker.id} state: ${
        wasInRange === true
          ? "IN_RANGE"
          : wasInRange === undefined
          ? "NEW_ENTRY"
          : "UNKNOWN"
      }`
    );

    if (wasInRange === true) {
      console.log(
        `⏭️ Skipping notification for marker ${marker.id} - already in range`
      );
      return;
    }

    const content: NotificationContent = {
      title: "Вы рядом с меткой! 📍",
      body: `${marker.title}\nРасстояние: ${Math.round(distance)} м`,
      data: {
        markerId: marker.id,
        distance: distance,
      },
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        data: content.data || {},
        sound: true,
      },
      trigger: null,
    });

    markerStates.set(marker.id, true);

    console.log(
      `✅ Notification shown for marker ${marker.id} (${
        marker.title
      }) at distance ${Math.round(distance)}m`
    );
  } catch (error) {
    console.error("Error showing notification:", error);
  } finally {
    processingNotifications.delete(marker.id);
  }
}

function markAsOutOfRange(markerId: string): void {
  const wasInRange = markerStates.get(markerId);
  if (wasInRange === true) {
    markerStates.delete(markerId);
    console.log(`🚪 User left range of marker ${markerId}`);
  }
}

async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
    markerStates.clear();
    processingNotifications.clear();
    console.log("All notifications and states cleared");
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
}

export const notificationManager = {
  initialize,
  showNotification,
  markAsOutOfRange,
  clearAllNotifications,
} as const;
