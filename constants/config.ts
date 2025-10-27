import { UIConfig } from "@/types";

export const UI_CONFIG: UIConfig = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    success: "#4CAF50",
    error: "#FF3B30",
    warning: "#FF9500",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    text: "#333333",
    textSecondary: "#666666",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 58.00484526875008,
    longitude: 56.208183021824986,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } as const,
  MARKER_DEFAULTS: {
    title: "Новый маркер",
    description: "Описание маркера",
  } as const,
} as const;

export const IMAGE_CONFIG = {
  PICKER_OPTIONS: {
    allowsEditing: true,
    aspect: [4, 3] as [number, number],
    quality: 0.8,
  },
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  GRID_COLUMNS: 2,
} as const;

export const ERROR_MESSAGES = {
  MARKER_NOT_FOUND: "Маркер не найден",
  IMAGE_PICK_FAILED: "Не удалось выбрать изображение",
  IMAGE_DELETE_FAILED: "Не удалось удалить изображение",
  PERMISSION_DENIED: "Разрешение на доступ к медиафайлам отклонено",
  NAVIGATION_FAILED: "Не удалось открыть детали маркера",
  MARKER_ADD_FAILED: "Ошибка при добавлении маркера",
  MARKER_UPDATE_FAILED: "Ошибка при обновлении маркера",
  MARKER_DELETE_FAILED: "Ошибка при удалении маркера",
  DATABASE_INIT_FAILED: "Не удалось инициализировать базу данных",
  DATABASE_CONNECTION_FAILED: "Не удалось подключиться к базе данных",
  DATABASE_TRANSACTION_FAILED: "Ошибка транзакции базы данных",
  DATABASE_MIGRATION_FAILED: "Ошибка миграции базы данных",
  DATABASE_CONSTRAINT_VIOLATION: "Нарушение ограничений базы данных",
  DATABASE_RECOVERY_FAILED: "Не удалось восстановить базу данных",
} as const;

export const UI_TEXTS = {
  BUTTONS: {
    ADD_PHOTO: "+ Добавить фото",
    DELETE: "Удалить",
    DELETE_MARKER: "Удалить маркер",
    CANCEL: "Отмена",
    OK: "OK",
  },
  TITLES: {
    IMAGES: "Изображения",
    MARKER_DETAILS: "Детали маркера",
    CONFIRM_DELETE: "Удалить изображение",
    CONFIRM_DELETE_MARKER: "Удалить маркер",
  },
  PLACEHOLDERS: {
    NO_IMAGES: "Нет изображений",
    NO_IMAGES_SUBTITLE: 'Нажмите "Добавить фото" чтобы начать',
  },
  CONFIRMATIONS: {
    DELETE_MARKER:
      "Вы уверены, что хотите удалить этот маркер? Все изображения будут также удалены.",
  },
  PERMISSIONS: {
    MEDIA_LIBRARY_TITLE: "Разрешение требуется",
    MEDIA_LIBRARY_MESSAGE:
      "Для выбора изображений необходимо разрешение на доступ к медиафайлам.",
  },
} as const;

export const SCREEN_CONFIG = {
  IMAGE_SIZE_RATIO: 2.5,
  MIN_IMAGE_SIZE: 100,
  MAX_IMAGE_SIZE: 200,
} as const;

export const LOCATION_CONFIG = {
  ACCURACY: 4,
  TIME_INTERVAL: 5000,
  DISTANCE_INTERVAL: 5,
  PROXIMITY_THRESHOLD: 100,
} as const;

export const NOTIFICATION_CONFIG = {
  CHANNEL_ID: "marker-proximity",
  CHANNEL_NAME: "Приближение к меткам",
} as const;
